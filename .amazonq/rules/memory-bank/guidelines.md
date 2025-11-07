# Iron Rails - Development Guidelines

## Code Quality Standards

### TypeScript Conventions
- **Strict Type Checking**: All code uses strict TypeScript with `noUncheckedIndexedAccess` enabled
- **Interface Definitions**: Use interfaces for data structures (e.g., `PlayerUpgrades`, `GameStateData`)
- **Type Safety**: Explicit typing for function parameters and return values
- **Null Safety**: Consistent null/undefined checks using optional chaining (`?.`) and logical operators

### Naming Conventions
- **Classes**: PascalCase (e.g., `GameScene`, `CombatSystem`, `SpatialGrid`)
- **Methods/Functions**: camelCase (e.g., `togglePause`, `calculateUpgradeCost`, `findNearestEnemy`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `EXPLOSION_RADIUS`, `STORAGE_KEY`, `SAVE_VERSION`)
- **Private Methods**: Prefixed with `private` keyword and camelCase (e.g., `private setupKeyboardControls`)

### Documentation Standards
- **JSDoc Comments**: Comprehensive documentation for public methods and complex logic
- **Inline Comments**: Explain business logic and non-obvious implementations
- **Parameter Documentation**: Document function parameters with types and descriptions
- **Return Value Documentation**: Clear documentation of return types and meanings

## Architectural Patterns

### Entity-Component-System (ECS) Implementation
- **Entity Creation**: Use `world.createEntity(type)` with consistent type strings
- **Component Assignment**: Direct property assignment (e.g., `entity.transform = { x, y, rotation }`)
- **System Processing**: Systems operate on entities with specific component combinations
- **Component Interfaces**: Data-only interfaces in `components/` directory

### State Management Patterns
- **Centralized State**: Single `GameState` class manages all persistent data
- **Immutable Updates**: Return copies of state objects to prevent mutation
- **Persistence Layer**: Automatic save/load with versioning and checksum validation
- **Default Values**: Comprehensive default state definitions with proper object spreading

### Scene Architecture
- **Scene Lifecycle**: Proper `init()`, `create()`, and `update()` method implementations
- **Data Passing**: Use scene data parameter for state transfer between scenes
- **System Initialization**: Initialize all systems in `create()` method
- **Cleanup**: Proper entity cleanup and memory management

## System Design Patterns

### Spatial Partitioning
- **Grid-Based**: Use `SpatialGrid` for efficient collision detection and queries
- **Entity Tracking**: Insert/remove entities from spatial grid on position changes
- **Range Queries**: Use `queryRadius()` for proximity-based operations
- **Performance**: Avoid O(n²) collision checks through spatial optimization

### Combat System Design
- **Callback Architecture**: Use callbacks for event handling (e.g., `onEnemyKilled`)
- **Damage Calculation**: Apply armor multipliers and damage scaling consistently
- **Range Checking**: Use squared distance comparisons to avoid expensive sqrt operations
- **State Validation**: Check entity existence and required components before operations

### Input Handling
- **Keyboard Events**: Use Phaser's keyboard event system with specific key bindings
- **State Toggles**: Implement pause/resume with proper time scale management
- **Speed Control**: Cycle through predefined speed values with user feedback
- **Event Feedback**: Provide immediate visual feedback for user actions

## Testing Standards

### Unit Test Structure
- **Test Organization**: Group tests by functionality using `describe` blocks
- **Setup/Teardown**: Use `beforeEach`/`afterEach` for consistent test isolation
- **Assertion Clarity**: Use descriptive test names and clear expectations
- **Edge Cases**: Test boundary conditions and error scenarios

### Test Coverage Areas
- **State Management**: Currency operations, upgrade purchases, level progression
- **Persistence**: Save/load functionality with data integrity checks
- **Business Logic**: Game mechanics and calculation functions
- **Error Handling**: Invalid input and edge case scenarios

## Performance Optimization

### Efficient Algorithms
- **Spatial Queries**: Use grid-based spatial partitioning for collision detection
- **Distance Calculations**: Use squared distance to avoid expensive square root operations
- **Entity Cleanup**: Remove off-screen entities to prevent memory leaks
- **Time-Based Updates**: Use delta time for frame-rate independent updates

### Memory Management
- **Entity Lifecycle**: Proper creation and destruction of game entities
- **Event Cleanup**: Remove event listeners and callbacks when no longer needed
- **Object Pooling**: Consider object pooling for frequently created/destroyed entities
- **Reference Management**: Avoid circular references and memory leaks

## Error Handling Patterns

### Defensive Programming
- **Input Validation**: Validate parameters and clamp values to acceptable ranges
- **Null Checks**: Consistent null/undefined checking before property access
- **Graceful Degradation**: Handle missing components or entities gracefully
- **Console Logging**: Use appropriate log levels for debugging and warnings

### Data Integrity
- **Save Validation**: Implement checksums and version checking for save data
- **Fallback Values**: Provide sensible defaults when data is corrupted or missing
- **Error Recovery**: Reset to known good state when critical errors occur
- **User Feedback**: Inform users of data issues without exposing technical details

## Code Organization

### File Structure
- **Single Responsibility**: Each file contains one primary class or related functionality
- **Import Organization**: Group imports by type (external libraries, internal modules)
- **Export Patterns**: Use named exports for classes and interfaces
- **Directory Separation**: Separate concerns into appropriate directories (components, systems, scenes)

### Dependency Management
- **Minimal Dependencies**: Keep external dependencies to essential libraries only
- **Version Pinning**: Use specific versions for reproducible builds
- **Development Tools**: Separate development dependencies from runtime dependencies
- **Build Configuration**: Maintain consistent build and test configurations