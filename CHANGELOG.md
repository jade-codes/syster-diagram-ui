# Changelog

All notable changes to `@opensyster/diagram-ui` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.5-alpha] - 2026-07-08

### Fixed

- **Crash when a node category is not in the theme map** (#4): `SysMLNode` looked up `theme.categories[category]` unguarded, so a symbol whose category is absent from the active theme yielded `undefined` and threw on the first color access — unmounting the whole diagram to a blank screen. The lookup now falls back to the always-present `other` category.
