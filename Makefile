.PHONY: run-guidelines typecheck test package clean

# Run all quality checks
run-guidelines: typecheck test

# Run TypeScript type checking
typecheck:
	bun run typecheck

# Run tests
test:
	bun test

# Package for publishing (placeholder)
package:
	@echo "Package target not yet implemented"

# Clean build artifacts
clean:
	rm -rf node_modules dist
