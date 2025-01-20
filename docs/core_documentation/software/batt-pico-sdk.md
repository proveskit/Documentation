# Battery PicoSDK Depreication
In PROVES Kit V2 we will be depreicating the RP2040 microcontroller on the battery board. As a result this code base will also be depreicated.

# Change Log Nov 4 2024 - Battery Manager Software V0.9.3 Update

## Added Safe Sleep and Watchdog Management
- Implemented `safe_sleep` function in tools class to prevent watchdog resets
- Fixed hibernation functions to use `safe_sleep`
- Added proper watchdog updates during sleep periods
- Added debug prints for sleep and watchdog operations
- Set configurable hibernate durations with class constants

## Code Structure Improvements
- Moved function implementations from .h to .cpp files
- Fixed header guards in tools.h (removed asterisks)
- Added initialization flags for all sensors
- Implemented safe wrapper functions for sensor operations
- Fixed member initialization order in constructors

## Error Handling and Validation
- Added validation for sensor readings in battery manager
- Improved error handling for invalid temperature readings
- Added status checks before sensor operations
- Implemented proper initialization status tracking
- Added debug prints for error conditions

## Future RTC Integration Preparation
- Added placeholder for RTC-based deep sleep functionality
- Added TODOs for future RTC integration
- Prepared GPIO27 configuration for RTC alarm
- Added comments documenting planned RTC features

## Bug Fixes
- Fixed resets caused by missing watchdog updates
- Corrected sensor initialization sequence
- Fixed LED driver configuration issues
- Resolved CAN bus initialization order
- Fixed initialization order warnings

## Clean Up
- Removed unused code
- Improved code organization
- Added consistent error reporting
- Enhanced debug output
- Standardized coding style

Next Steps:
- Implement RTC library integration
- Add deep sleep functionality
- Enhance power management
- Add more sensor validation
- Consider retry mechanisms for failed sensor reads