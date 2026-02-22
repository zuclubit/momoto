# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 6.x     | :white_check_mark: |
| < 6.0   | :x:                |

## Reporting a Vulnerability

### Do NOT

- Open a public GitHub issue for security vulnerabilities
- Discuss vulnerabilities in public forums
- Publish vulnerability details before fix is released

### Do

1. **Email:** security@momoto.dev (or maintainers directly)
2. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

| Phase | Timeline |
|-------|----------|
| Acknowledgment | 48 hours |
| Initial assessment | 7 days |
| Fix development | 14-30 days |
| Public disclosure | After fix released |

### Severity Classification

| Severity | Description | Response |
|----------|-------------|----------|
| Critical | Remote code execution, data exposure | Immediate patch |
| High | Logic bypass, DoS | Patch within 7 days |
| Medium | Information disclosure, edge cases | Next scheduled release |
| Low | Theoretical issues, hardening | When convenient |

## Security Considerations

### What Momoto Handles

- Color calculations (numerical)
- Material physics (numerical)
- Accessibility metrics (numerical)

### What Momoto Does NOT Handle

- User authentication
- Network communication
- File system access (core crates)
- Sensitive data

### Dependency Policy

- Core crates have **zero dependencies**
- WASM crate depends only on `wasm-bindgen` ecosystem
- All dependencies are reviewed before addition

### Audit Status

| Crate | Last Audit | Status |
|-------|------------|--------|
| momoto-core | Pending | Unaudited |
| momoto-metrics | Pending | Unaudited |
| momoto-intelligence | Pending | Unaudited |
| momoto-materials | Pending | Unaudited |
| momoto-wasm | Pending | Unaudited |

## Known Limitations

### Numerical Precision

- Floating point operations may have precision limits
- Extreme values may produce unexpected results
- This is NOT a security vulnerability

### WASM Considerations

- WASM runs in browser sandbox
- No additional security guarantees beyond browser model

## Responsible Disclosure

We follow responsible disclosure practices:

1. Researcher reports vulnerability privately
2. We acknowledge and investigate
3. We develop and test fix
4. We release fix
5. We credit researcher (if desired)
6. Public disclosure after fix available

## Bug Bounty

Currently no formal bug bounty program.

Researchers will be credited in:
- SECURITY.md (this file)
- CHANGELOG.md
- Release notes

## Contact

- Security issues: security@momoto.dev
- General issues: GitHub Issues
