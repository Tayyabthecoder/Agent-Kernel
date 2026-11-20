---
name: windows-desktop-e2e
description: E2E testing for Windows native desktop apps (WPF, WinForms, Win32/MFC, Qt) using pywinauto and Windows UI Automation. Use when writing E2E tests for a Windows native desktop app with pywinauto or UI Automation.
metadata:
  origin: ECC
---

# Windows Desktop E2E Testing

End-to-end testing for Windows native desktop applications using **pywinauto** backed by Windows UI Automation (UIA). Covers WPF, WinForms, Win32/MFC, and Qt (5.x / 6.x) — with Qt-specific guidance as a dedicated section.

## When to Activate

- Writing or running E2E tests for a Windows native desktop application
- Setting up a desktop GUI test suite from scratch
- Diagnosing flaky or failing desktop automation tests
- Adding testability (AutomationId, accessible names) to an existing app
- Integrating desktop E2E into a CI/CD pipeline (GitHub Actions `windows-latest`)

### When NOT to Use

- Web applications → use `e2e-testing` skill (Playwright)
- Electron / CEF / WebView2 apps → the HTML layer needs browser automation, not UIA
- Mobile apps → use platform-specific tools (UIAutomator, XCUITest)
- Pure unit or integration tests that don't need a running GUI

## Core Concepts

All Windows desktop automation relies on **UI Automation (UIA)**, a Windows-built-in accessibility API. Every supported framework exposes a tree of UIA elements with properties Claude can read and act on:

```
Your test (Python)
    └── pywinauto (UIA backend)
        └── Windows UI Automation API   ← built into Windows, framework-agnostic
            └── App's UIA provider      ← each framework ships its own
                └── Running .exe
```

**UIA quality by framework:**

| Framework | AutomationId | Reliability | Notes |
|-----------|-------------|-------------|-------|
| WPF | 5/5 | Excellent | `x:Name` maps directly to AutomationId |
| WinForms | 4/5 | Good | `AccessibleName` = AutomationId |
| UWP / WinUI 3 | 5/5 | Excellent | Full Microsoft support |
| Qt 6.x | 5/5 | Excellent | Accessibility enabled by default; class names change to `Qt6*` |
| Qt 5.15+ | 4/5 | Good | Improved Accessibility module |
| Qt 5.7–5.14 | 3/5 | Fair | Needs `QT_ACCESSIBILITY=1`; objectName manual |
| Win32 / MFC | 3/5 | Fair | Control IDs accessible; text matching common |

## Setup & Prerequisites

```bash
# Python 3.8+, Windows only
pip install pywinauto pytest pytest-html Pillow pytest-timeout
# Optional: screen recording
# Install ffmpeg and add to PATH: https://ffmpeg.org/download.html
```

Verify UIA is reachable:

```python
from pywinauto import Desktop
Desktop(backend="uia").windows()  # lists all top-level windows
```

Install **Accessibility Insights for Windows** (free, from Microsoft) — your DevTools equivalent for inspecting the UIA element tree before writing any test.

## Testability Setup (by Framework)

The single most impactful thing you can do is **give every interactive control a stable AutomationId** before writing tests.

### WPF

```xml
<!-- XAML: x:Name becomes AutomationId automatically -->
<TextBox x:Name="usernameInput" />
<PasswordBox x:Name="passwordInput" />
<Button x:Name="btnLogin" Content="Login" />
<TextBlock x:Name="lblError" />
```

### WinForms

```csharp
// Set in designer or code
usernameInput.AccessibleName = "usernameInput";
passwordInput.AccessibleName = "passwordInput";
btnLogin.AccessibleName = "btnLogin";
lblError.AccessibleName = "lblError";
```

### Win32 / MFC

```cpp
// Control resource IDs in .rc file are exposed as AutomationId strings
// IDC_EDIT_USERNAME -> AutomationId "1001"
// Prefer SetWindowText for Name; add IAccessible for richer support
```

### Qt — see dedicated section below

---

## Page Object Model

See [references/page-object-model.md](references/page-object-model.md).

## Locator Strategy

```
AutomationId  >  Name (text)  >  ClassName + index  >  XPath
  (stable)         (readable)       (fragile)           (last resort)
```

Inspect with Accessibility Insights → **Properties** pane → look for `AutomationId` first.

```python
# Inspect at runtime — paste into a REPL to explore the tree
win.print_control_identifiers()
# or narrow scope:
win.child_window(auto_id="groupBox1").print_control_identifiers()
```

## Wait Patterns

```python
# Wait for control to appear
page.wait_visible(page.by_id("statusLabel"))

# Wait for control to disappear (e.g. loading spinner)
page.wait_gone(page.by_id("spinnerOverlay"))

# Wait for a dialog to pop up
dlg = page.wait_window("Confirm Delete")

# Custom condition (e.g. text changes)
page.wait_until(lambda: page.get_text(page.by_id("lblStatus")) == "Ready")
```

**Never use `time.sleep()` as primary synchronization** — use `wait()` or `wait_until()`.

## Artifact Management

```python
# Screenshot on demand
page.screenshot("after_login")

# Full-screen capture (when window is off-screen or minimised)
import pyautogui
pyautogui.screenshot("artifacts/fullscreen.png")

# Screen recording with ffmpeg (start before test, stop after)
import subprocess

def start_recording(name):
    return subprocess.Popen([
        "ffmpeg", "-f", "gdigrab", "-framerate", "10",
        "-i", "desktop", "-y", f"artifacts/videos/{name}.mp4"
    ], stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def stop_recording(proc):
    proc.stdin.write(b"q"); proc.stdin.flush(); proc.wait(timeout=10)
```

## Per-Step Trace (opt-in)

The default failure screenshot is often too thin for diagnosing flaky tests. The step-level trace below is **off by default** — enable it only when reproducing a flaky case.

### Enable

```bash
E2E_TRACE=1 pytest tests/test_login.py -v
# Include typed text in the JSONL log (DO NOT use on tests that type credentials/PII):
E2E_TRACE=1 E2E_TRACE_INCLUDE_TEXT=1 pytest ...
```

### Patch into BasePage

```python
import os, json, time
TRACE_ENABLED      = os.environ.get("E2E_TRACE") == "1"
TRACE_INCLUDE_TEXT = os.environ.get("E2E_TRACE_INCLUDE_TEXT") == "1"

class BasePage:
    _step = 0

    def _trace(self, action, spec=None, text=None):
        if not TRACE_ENABLED:
            return
        BasePage._step += 1
        idx = f"{BasePage._step:03d}"
        os.makedirs(ARTIFACT_DIR, exist_ok=True)
        try:
            self.window.capture_as_image().save(
                os.path.join(ARTIFACT_DIR, f"step_{idx}_{action}.png"))
        except Exception:
            pass  # capture failure must not break the test
        rec = {
            "ts": time.time(), "step": BasePage._step, "action": action,
            "locator": getattr(spec, "criteria", None),
            "text": text if TRACE_INCLUDE_TEXT else ("<redacted>" if text else None),
        }
        with open(os.path.join(ARTIFACT_DIR, "trace.jsonl"), "a") as f:
            f.write(json.dumps(rec) + "\n")

    def click(self, spec):
        self.wait_visible(spec); self._trace("click_before", spec)
        spec.click_input();      self._trace("click_after",  spec)

    def type_text(self, spec, text):
        self.wait_visible(spec); self._trace("type_before", spec, text)
        # ... existing set_edit_text / keyboard fallback ...
        self._trace("type_after", spec)
```

### Caveats

- **PII / credentials**: `type_text` content is `<redacted>` by default. Never set `E2E_TRACE_INCLUDE_TEXT=1` on login or payment flows.
- **Overhead**: ~50–200ms per action + one PNG per step on disk. Don't enable on the default CI matrix — only on a dedicated flake-repro job.
- **Artifact bloat**: a long flow produces tens of MB; tune `retention-days` accordingly.
- **Parallel/rerun hygiene**: this simple example appends to `trace.jsonl` and uses a class-level counter. Clear the artifact directory before reruns, and use per-worker artifact dirs for parallel tests.
- **Coverage gap**: actions performed outside `BasePage` (raw `pywinauto` calls in test code) are not traced.

## Flaky Test Handling

```python
# Quarantine — equivalent to Playwright's test.fixme()
@pytest.mark.skip(reason="Flaky: animation race on slow CI. Issue #42")
def test_animated_transition(self, app): ...

# Skip in CI only
@pytest.mark.skipif(os.environ.get("CI") == "true", reason="Flaky in CI #43")
def test_heavy_load(self, app): ...
```

Common causes and fixes:

| Cause | Fix |
|-------|-----|
| Control not ready | Replace `time.sleep` with `wait_visible` |
| Window not focused | Add `win.set_focus()` before interactions |
| Animation in progress | `wait_until(lambda: not loading_indicator.exists())` |
| Dialog timing | `wait_window(title, timeout=15)` |
| CI display not ready | Set `DISPLAY` or use virtual desktop in CI |
| `set_edit_text` raises NotImplementedError | UIA ValuePattern missing (common on Qt 5.x) — `BasePage.type_text` already falls back to `keyboard.send_keys` |
| Control exists but `wait_visible` times out | Window minimised or off-screen — call `win.restore()` + `win.set_focus()` before waiting |

## Test Isolation & Sandbox

See [references/test-isolation.md](references/test-isolation.md).

## CI/CD Integration

```yaml
# .github/workflows/e2e-desktop.yml
name: Desktop E2E
on: [push, pull_request]

jobs:
  e2e:
    runs-on: windows-latest   # real GUI environment, no Xvfb needed
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }

      - name: Install deps
        run: pip install pywinauto pytest pytest-html Pillow

      - name: Build app
        run: cmake --build build --config Release  # adjust to your build system

      - name: Run E2E
        env:
          APP_PATH: ${{ github.workspace }}\build\Release\MyApp.exe
          APP_TITLE: "My Application"
          CI: "true"
        run: pytest tests/ --html=artifacts/report.html --self-contained-html --junitxml=artifacts/results.xml -v

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: e2e-artifacts
          path: artifacts/
          retention-days: 14
```

## Qt Specific

See [references/qt-and-screenshot-mode.md](references/qt-and-screenshot-mode.md).

## Fallback: Screenshot Mode

See [references/qt-and-screenshot-mode.md](references/qt-and-screenshot-mode.md).

## Anti-Patterns

```python
# BAD: fixed sleep
time.sleep(3)
page.click(page.by_id("btnSubmit"))

# GOOD: condition wait
page.wait_visible(page.by_id("btnSubmit"))
page.click(page.by_id("btnSubmit"))
```

```python
# BAD: brittle class+index locator as primary strategy
page.by_class("Edit", index=2).type_keys("hello")

# GOOD: AutomationId
page.by_id("usernameInput").set_edit_text("hello")
```

```python
# BAD: assert on pixel coordinates
assert btn.rectangle().left == 120

# GOOD: assert on content / state
assert page.get_text(page.by_id("lblStatus")) == "Logged in"
assert page.by_id("btnLogout").is_enabled()
```

```python
# BAD: share app instance across all tests (state leaks)
@pytest.fixture(scope="session")
def app(): ...

# GOOD: fresh process per test (or per class at most)
@pytest.fixture(scope="function")
def app(): ...
```

## Running Tests

```bash
# All tests
pytest tests/ -v

# Smoke only
pytest tests/ -m smoke -v

# Specific file
pytest tests/test_login.py -v

# With custom app path
APP_PATH="C:\build\Release\MyApp.exe" APP_TITLE="MyApp" pytest tests/ -v

# Detect flaky tests (repeat each 5 times)
pip install pytest-repeat
pytest tests/test_login.py --count=5 -v
```

## Related Skills

- `e2e-testing` — Playwright E2E for web applications
- `cpp-testing` — C++ unit/integration testing with GoogleTest
- `cpp-coding-standards` — C++ code style and patterns
