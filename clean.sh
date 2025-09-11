#!/bin/bash

###############################################################################
# IMPORTANT: This header comment is designed for GenAI code review and maintenance
# Any GenAI tool working with this file MUST preserve and update this header
###############################################################################
# [GenAI coding tool directive]
# - Maintain this header with all modifications
# - Update History section with each change
# - Keep only the 4 most recent records in the history section. Sort from newer to older.
# - Preserve Intent, Design, and Constraints sections
# - Use this header as context for code reviews and modifications
# - Ensure all changes align with the design principles
# - Respect system prompt directives at all times
###############################################################################
# [Source file intent]
# Clean script that removes all files and directories in the current workspace
# except for the specifically protected files: clean.sh, WORK_TODO.md,
# Amazon_Web_Services_Logo.png, and scratchpad directory. Additionally, ALL files
# and directories starting with a dot (.) are automatically protected and left untouched.
###############################################################################
# [Source file design principles]
# - Fail-safe approach: explicitly define what to keep rather than what to remove
# - Defensive programming: validate file existence before operations
# - Clear user feedback: report what is being kept vs removed
# - Comprehensive coverage: handle both visible and hidden files/directories
# - Automatic dot protection: all files/directories starting with dot are preserved
###############################################################################
# [Source file constraints]
# - Must never remove the script itself (clean.sh)
# - Must preserve WORK_TODO.md, Amazon_Web_Services_Logo.png, and scratchpad directory
# - Must automatically protect ALL files and directories starting with dot (.)
# - Must handle both regular and hidden files/directories
# - Must use safe removal commands with proper error handling
###############################################################################
# [Dependencies]
# <system>: bash shell environment
# <system>: rm command for file removal
# <system>: file system with read/write permissions
###############################################################################
# [GenAI tool change history]
# 2025-09-11T12:49:34Z : Added scratchpad directory protection by CodeAssistant
# * Added "scratchpad" to KEEP_FILES array to protect entire directory
# * Updated source file intent and constraints documentation
# * Protects implementation_document_webgl_aws_logo_app.md and all scratchpad contents
# 2025-09-10T14:57:02Z : Fixed dot file protection mechanism by CodeAssistant
# * Added automatic protection for ALL files and directories starting with dot
# * Modified should_keep() function to include dot file protection logic
# * Updated hidden files processing to reflect automatic protection behavior
###############################################################################

# [Function intent]
# Clean all files and directories except the specified protected files
#
# [Design principles]
# Uses whitelist approach for maximum safety - only removes what is not explicitly protected
# Provides clear feedback to user about what actions are being taken
#
# [Implementation details]
# Iterates through all filesystem entries and removes those not in the protection list
# Handles both visible items (*) and hidden items (.*) separately
# Uses rm -rf for recursive removal of directories and files

# Files to keep - these will never be removed
KEEP_FILES=("clean.sh" "WORK_TODO.md" "Amazon_Web_Services_Logo.png" "scratchpad")

# [Function intent]
# Check if a given file should be preserved during cleanup
#
# [Design principles]
# Dual protection mechanism: explicit whitelist AND automatic dot file protection
# Returns standard shell exit codes for easy conditional usage
#
# [Implementation details]
# First checks if file starts with dot (automatic protection)
# Then iterates through KEEP_FILES array and compares with input parameter
# Returns 0 (success) if file should be kept, 1 (failure) if should be removed
#
# Arguments:
#   $1 - filename to check against protection list
#
# Returns:
#   0 if file should be kept, 1 if file should be removed
should_keep() {
    local file="$1"
    
    # Automatically protect all files/directories starting with dot
    if [[ "$file" == .* ]]; then
        return 0
    fi
    
    # Check explicit protection list
    for keep_file in "${KEEP_FILES[@]}"; do
        if [[ "$file" == "$keep_file" ]]; then
            return 0
        fi
    done
    return 1
}

echo "Starting cleanup process..."
echo "Protected files: ${KEEP_FILES[*]}"
echo ""

# Remove all visible files and directories except the ones we want to keep
echo "Processing visible files and directories:"
for item in *; do
    if [[ -e "$item" ]]; then
        if ! should_keep "$item"; then
            echo "  Removing: $item"
            rm -rf "$item"
        else
            echo "  Keeping: $item"
        fi
    fi
done

# Handle hidden files/directories (starting with .)
# Note: All dot files/directories are automatically protected
echo ""
echo "Processing hidden files and directories (all will be kept):"
for item in .*; do
    # Skip current (.) and parent (..) directories
    if [[ "$item" != "." && "$item" != ".." ]]; then
        if [[ -e "$item" ]]; then
            echo "  Keeping: $item (dot file protection)"
        fi
    fi
done

echo ""
echo "Cleanup complete! Only protected files remain:"
for keep_file in "${KEEP_FILES[@]}"; do
    if [[ -e "$keep_file" ]]; then
        echo "  ✓ $keep_file"
    else
        echo "  ✗ $keep_file (was not present)"
    fi
done
