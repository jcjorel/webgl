# Claude AI Assistant Rules and Guidelines

This document consolidates all rules and guidelines from ~/Cline/Rules for Claude AI assistant operation.

---

# User Identity Configuration
# 🚨 THIS FILE CONTAINS PII - NEVER COMMIT TO ANY REPOSITORY 🚨

## Personal Information
- **User Firstname**: Jean-Charles
- **User Lastname**: JOREL
- **User Corporate Login**: jcjorel
- **User Job Description**: Principal Solutions Architect

## Location Information  
- **User Country**: France
- **User Town**: Paris
- **User Timezone**: Europe/Paris

## Company Information
- **User Company Name**: AWS
- **User Company Corporate URL**: https://aws.amazon.com/fr/

---

# Amazon Specific Tools and Guidelines

## Phonetool
- To get information about an Amazon employee, novaigate to access https://phonetool.amazon.com/users/<userlogin>
Note: You will find easily manager(s) and coleagues of an Amazon employee by looking at and scrolling the "Org Chart" widget.
Note: You will find Amazon people statistics in the "Old Fart" widget at the very bottom of the page.

## SFDC Usage

When the user is asking information about an AWS customer, navigate to https://aws-crm.lightning.force.com/lightning/page/home.
- If you see "Se connecter avec AWS Single Sign-One", click on this button and wait the next page
- From the main page, you WILL use the "Search" textbox to retrieve information about an AWS commercial account and any available information. If you do not see the account you are looking for in the recent search list, you will type the account name in the Search text field and hit return.
**SFDC is slow to display so if you see the page still loading, you will wait a bit before to recapture a screenshot.**
**Note: You will always scroll the whole page to find "AWS Total Account Amortized Revenue" string that is the current customer spend (MRR) on AWS**
If you see a table named "Accounts", you can click of an item of the column "Account Name" to get details on it.
Tips:
- Through SFDC, you can access the MRR (Monthly Recurring Revenue - Total Account Amortized Revenue) of an account. The ARR (Annual Recurring Revenue) can be extrapolated by multiplying by 12 the MRR.

## ChatGPT

You can use ChatGPT (https://chatgpt.com/) to gather context about a topic where Perplexity MCP server as difficulty to find relevant data.

When you ask a question to ChatGPT, 
* you must click on the black upward arrow close the mic symbol to get your question submitted.
* you must not use multi-line input text and you will use "Enter" key only when you finished to write in full your question.
* when you see a small white-background circled black-arrow going downward above the input textfield, it means that there are other things to read and you will click on it.

When you reuse an existing conversation,:
* you will click on the white margin at left of the conversation to place pointer focus in the conversation pane. 
* Then, you will hit the named "Home" keyboard key to go to the beginning of the conversation.
* You will scroll with "Scroll down" key up to the end to read the existing conversation in full.

If you are not **EXPLICITLY** asked to reuse an existing conversation, disregard any historical past conversations listed in the sidebar and always ask a new question.

---

# MCP Server Usage Guidelines

## Context7 MCP Server

Always use Context7 MCP Server to get hints about latest changes of any application framework (React.js, Agno, Material UI, etc...) you use. 
Always use Context7 MCP Server when you encounter an incorrect API usage, to get precise API documentation.
Always use Context7 to get example code snippet for any application framework you use.
For AWS related documentation, always use AWS Documentation MCP Server.

## General External Information Fetching

# Always fetch fresh external component information
- Always use, **even in PLAN mode**, 'ask_perplexity' MCP tool for latest best practices and news when developping/debuging with external component dependencies (like open source or third-party projects)

---

# JESSE_CODE_COMMENTS.md - Consolidated Code Documentation Standards

This file consolidates ALL code documentation rules for the project, serving as the single source of truth for code comments, headers, and documentation standards.

## 1. CRITICAL FOUNDATION RULES

### 1.1 Non-Negotiable Three-Section Pattern
⚠️ **CRITICAL**: ALL functions, methods, and classes MUST include the three-section documentation pattern regardless of size or complexity. **NO EXCEPTIONS PERMITTED** (except for Markdown files). This is a non-negotiable project standard that takes precedence over all other considerations except correct code functionality.

**The Three Mandatory Sections (in exact order):**
```
[Function/Class method/Class intent] <!-- It is **critical** to fully capture and contextualize the intent -->
[Design principles]
[Implementation details]
```

### 1.2 Universal Application Policy
- This pattern applies to ALL code elements without exception:
  - Every function (including one-liners)
  - Every method (including getters/setters)
  - Every class (including simple data classes)
  - Every script entry point
- File size, complexity, or "obviousness" are NOT valid exceptions

### 1.3 Self-Correction Mechanism
If you notice you've implemented code without proper documentation:
1. **IMMEDIATELY** stop further implementation
2. Add the missing documentation sections in the correct order
3. Verify against the checklist
4. Resume implementation only after documentation is complete

## 2. FILE-LEVEL DOCUMENTATION STANDARDS

### 2.1 Mandatory File Header Template
All non-markdown files (including Dockerfile, Shell scripts...) MUST begin with this exact header structure:

```
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
# <Describe the detailed purpose of this file. Intent must be fully captured and contextualized.>
###############################################################################
# [Source file design principles]
# <List key design principles guiding this implementation>
###############################################################################
# [Source file constraints]
# <Document any limitations or requirements for this file>
###############################################################################
# [Dependencies] <!-- Never reference documents in <project_root>/scratchpad/ directory -->
# <File paths of others codebase and documentation files. List also language specific libraries if any>
# <List of markdown files in doc/ that provide broader context for this file>
# <Prefix the dependency with its kind like "<codebase|system|other>:<dependency>"
#    <"codebase" kind means a reference to any artifact in the current project codebase>
#    <"system" kind means a reference toward an external artifact provided by the environement (files, librairies, modules...)>
###############################################################################
# [GenAI tool change history] <!-- Change history sorted from the newest to the oldest -->
# YYYY-MM-DDThh:mm:ssZ : <summary of change> by CodeAssistant
# * <change detail>
###############################################################################
```

### 2.2 Header Application Rules
- Place header at the very top of each file before any other content
- Apply to ALL non-markdown files in the project
- Maintain header completeness - no sections may be omitted
- Update header content to reflect file evolution

### 2.3 Change History Management
- Document all changes using precise timestamp format: `YYYY-MM-DDThh:mm:ssZ`
- Keep only the 4 most recent records, sorted newest to oldest
- Include both summary and detailed change information
- Never delete the history section entirely

## 3. FUNCTION/METHOD/CLASS DOCUMENTATION STANDARDS

### 3.1 The Three-Section Documentation Pattern

#### Section 1: Intent
- **Label**: `[Function intent]`, `[Class method intent]`, or `[Class intent]`
- **Purpose**: Clear description of what the code element does and why it exists
- **Requirements**: Must fully capture and contextualize the purpose

#### Section 2: Design Principles
- **Label**: `[Design principles]`
- **Purpose**: Patterns, approaches, and architectural decisions
- **Requirements**: Must explain WHY the code is designed this way and how/when to use it

#### Section 3: Implementation Details
- **Label**: `[Implementation details]`
- **Purpose**: HOW the code works internally
- **Requirements**: Key algorithms, data structures, and technical notes with enough information to help code element maintenance

### 3.2 Documentation Quality Standards
- Write insightful comments that allow understanding without need for reading code
- When using adjectives (e.g., "efficient", "robust"), ALWAYS provide specific factual justifications in the same sentence
- Avoid vague wording - provide precise technical reasons
- Design principles should enable reuse elsewhere in the codebase
- Implementation details should aid maintenance and debugging

### 3.3 Standard Parameter/Return Documentation
Include language-appropriate parameter and return documentation:
- Parameter types and descriptions
- Return value types and meanings
- Exception/error conditions
- Side effects (if any)

## 4. LANGUAGE-SPECIFIC TEMPLATES

### 4.1 Python Documentation Template

#### Python Function Template
```python
def function_name(param1, param2, optional_param=None):
    """
    [Function intent]
    Clear description of the function's purpose and role in the system.
    
    [Design principles]
    Patterns and approaches used, along with rationale for design choices.
    
    [Implementation details]
    Key technical implementation notes like algorithms used, processing flow, etc.
    
    Args:
        param1 (type): Description of first parameter
        param2 (type): Description of second parameter
        optional_param (type, optional): Description of optional parameter. Defaults to None.
        
    Returns:
        type: Description of return value
        
    Raises:
        ExceptionType: When and why this exception is raised
    """
    # Implementation...
```

#### Python Class Template
```python
class ClassName:
    """
    [Class intent]
    Clear description of the class's purpose and role in the system.
    
    [Design principles]
    Patterns and approaches used, along with rationale for design choices.
    
    [Implementation details]
    Key technical implementation notes, inheritance details, etc.
    """
    
    def __init__(self, param1, param2=None):
        """
        [Class method intent]
        Initialize a new instance of the class.
        
        [Design principles]
        Design decisions related to initialization.
        
        [Implementation details]
        How parameters are stored and initial state is set up.
        
        Args:
            param1 (type): Description of first parameter
            param2 (type, optional): Description of second parameter. Defaults to None.
        """
        # Implementation...
```

### 4.2 JavaScript Documentation Template

```javascript
/**
 * [Class intent]
 * Manages user authentication state and processes throughout the application.
 *
 * [Design principles]
 * Single responsibility for auth state management.
 * Clear separation between auth logic and UI components.
 *
 * [Implementation details]
 * Implements the Observer pattern to notify components of auth state changes.
 * Uses localStorage for persistent login state with encryption.
 *
 * @class AuthManager
 */
class AuthManager {
  /**
   * [Class method intent]
   * Creates a new AuthManager instance with initial configuration.
   *
   * [Design principles]
   * Fail-secure initialization with validation of stored credentials.
   *
   * [Implementation details]
   * Sets up listeners and initializes from encrypted localStorage if available.
   *
   * @param {Object} config - Configuration options
   * @param {boolean} config.autoRefresh - Whether to auto-refresh tokens
   */
  constructor(config) {
    // Implementation...
  }
}
```

### 4.3 Bash Documentation Template

```bash
#!/usr/bin/env bash

# [Script intent]
# Clear description of the script's purpose and role in the system.
#
# [Design principles]
# Patterns and approaches used, along with rationale for design choices.
#
# [Implementation details]
# Key technical implementation notes like algorithms used, processing flow, etc.
#
# Usage: script_name.sh [OPTIONS]
# Options:
#   -h, --help     Show usage information
#   -v, --verbose  Enable verbose output
#
# Exit Codes:
#   0 - Success
#   1 - General error

# [Function intent]
# Clear description of the function's purpose.
#
# [Design principles]
# Why the function is designed this way.
#
# [Implementation details]
# How the function works internally.
#
# Arguments:
#   $1 - Description of first argument
#   $2 - Description of second argument
#
# Returns:
#   0 on success, non-zero on error
function function_name() {
  # Implementation...
  return 0
}
```

## 5. DOCUMENTATION QUALITY & VERIFICATION

### 5.1 Quality Criteria
- **Completeness**: All three sections present and meaningful
- **Clarity**: Understandable without reading the implementation
- **Specificity**: Concrete details, not generic statements
- **Justification**: All quality claims backed by technical reasons
- **Consistency**: Aligned with file header and project documentation

### 5.2 Verification Checklist
After implementing ANY function, method, or class, ALWAYS verify:
1. ✓ Documentation includes ALL THREE required sections in exact order
2. ✓ Section labels match the template exactly
3. ✓ Intent section fully captures the purpose
4. ✓ Design principles explain the "why"
5. ✓ Implementation details explain the "how"
6. ✓ Parameter/return documentation matches actual signature
7. ✓ Exception documentation covers all error cases
8. ✓ No outdated or contradictory information

### 5.3 Consistency Requirements
- Function/method documentation must align with file header intent
- Design principles must be consistent across related functions
- Implementation details must match actual code behavior
- All documentation must use present tense (no "was implemented" or "will be")
- All texts generated within function/class comments, file headers, or documentation MUST NEVER refer to past implementations

## 6. DOCUMENTATION LIFECYCLE MANAGEMENT

### 6.1 File Modification Protocol
When modifying any file:
1. **ALWAYS** update the file header history section
2. **ALWAYS** update file intent/design if modifications change them
3. **ALWAYS** ensure function/method/class comments remain accurate
4. **ALWAYS** verify consistency between header and function documentation

### 6.2 Change History Requirements
- Use precise timestamp format: `YYYY-MM-DDThh:mm:ssZ`
- Include meaningful summary and specific details
- Maintain 4-entry limit (remove oldest when adding new)
- Sort entries from newest to oldest

### 6.3 Markdown Changelog Integration
For markdown file modifications, follow the standards detailed in `JESSE_MARKDOWN.md` Section 7 "Lifecycle Management".

### 6.4 Post-Modification Verification
After any file modification:
1. Verify file existence and syntax correctness
2. Confirm all documentation sections remain valid
3. Check for consistency across all documentation levels
4. Ensure no documentation refers to past implementations

## 7. ENFORCEMENT AND COMPLIANCE

### 7.1 Zero-Tolerance Policy
- Missing documentation is a **blocking issue**
- Incomplete documentation must be fixed before proceeding
- "TODO: Add documentation" is NOT acceptable
- Documentation quality is as important as code quality

### 7.2 Compliance Verification Process
1. **Before commit**: Verify all new/modified code has complete documentation
2. **During review**: Check documentation quality and completeness
3. **After merge**: Monitor for documentation degradation
4. **Periodic audit**: Ensure ongoing compliance

### 7.3 Documentation Debt Prevention
- Never accumulate documentation debt
- Fix documentation issues immediately when discovered
- Update documentation BEFORE modifying code
- Treat documentation as part of the implementation

---

**Remember**: This consolidated rule supersedes all previous scattered documentation rules. When in doubt, refer to this document as the authoritative source for all code documentation standards.

---

# JESSE_CODE_GENERATION.md - Consolidated Code Generation Standards

This file consolidates ALL code generation rules for the project, serving as the single source of truth for code creation, implementation approaches, and execution standards.

## 1. CRITICAL FOUNDATION RULES

### 1.1 Non-Negotiable Code Generation Standards
⚠️ **CRITICAL**: All code generation MUST follow these consolidated standards. **NO EXCEPTIONS PERMITTED**. This is a non-negotiable project standard that takes precedence over scattered individual rules.

### 1.2 Universal Application Policy
- These standards apply to ALL code generation activities without exception
- Task complexity, urgency, or scope are NOT valid exceptions
- Consistency across all code generation is mandatory

## 2. KISS (KEEP IT SIMPLE & STUPID) APPROACH

### 2.1 Core KISS Principles
When designing solutions and generating code, you MUST systematically apply a KISS approach:
- **Implement exactly what the user requested - no more, no less**
- Avoid adding "nice-to-have" features or optimizations unless explicitly requested
- Choose straightforward implementations over clever or complex ones
- Break down complex solutions into simple, understandable components
- Prioritize readability and maintainability over brevity or elegance
- When multiple implementation options exist, default to the simplest one that meets requirements
- Proactively highlight when a requested feature might be unnecessary or overly complex

### 2.2 Why KISS Matters
Generating non-requested features confuses the user and contradicts your core role as a caring assistant. Always err on the side of simplicity and clarity.

## 3. ERROR HANDLING STRATEGY

### 3.1 Defensive Programming Philosophy
Safe coding means not burying issues with workarounds and fallbacks. You will prefer to find issue root causes immediately by crashing the software (defensive programming) instead of falling back to a degraded mode difficult to debug.

### 3.2 Error Handling Rules
- **Implement "throw on error" behavior for ALL error conditions without exception**
- Do not silently catch errors - always include both error logging and error re-throwing
- Never return null, undefined, or empty objects as a response to error conditions
- Construct descriptive error messages that specify:
  1. The exact component that failed
  2. The precise reason for the failure
- **NEVER implement any fallback mechanisms or graceful degradation behavior without explicit user approval**

## 4. DRY PRINCIPLE IMPLEMENTATION

### 4.1 Code-Level DRY
Strictly adhere to the DRY (Don't Repeat Yourself) principle in all implementations:
- Identify and eliminate any duplicate logic in code
- Extract common functionality into dedicated reusable components
- Apply inheritance, composition, and abstraction patterns appropriately
- Refactor existing code sections when introducing similar functionality
- Proactively identify repeated patterns before committing any changes

### 4.2 Documentation-Level DRY
- Prevent information duplication across documentation files
- Use cross-references between documents instead of copying content
- Establish single sources of truth for any information that appears in multiple places

## 5. CONSISTENCY PROTECTION

### 5.1 Documentation-Code Alignment
When proposed code changes would contradict existing documentation:
1. **STOP implementation immediately without proceeding further**
2. Quote the contradicting documentation exactly: "Documentation states: [exact quote]"
3. Present exactly two options to the user:
   - "OPTION 1 - ALIGN WITH DOCS: [specific code implementation that follows documentation]"
   - "OPTION 2 - UPDATE DOCS: [exact text changes required to align documentation with code]"
4. For conflicts between documentation files, request explicit clarification on which document takes precedence

### 5.2 Project Vision Alignment
You are an expert coding assistant that strictly follows project documentation to produce code aligned with the established project vision and architecture. When generating code:
- Base new features on design documentation
- Base modifications on HSTC documentation
- Use both systems when refactoring or addressing technical debt

## 6. FILE MODIFICATION RULES

### 6.1 Documentation Requirements
- Add or maintain header comments in every file using the applicable template (see `JESSE_CODE_COMMENTS.md` for complete standards)
- **After updating any codebase file, ALWAYS ensure that function/class method/class comments are consistent with the changes made**
- **ALWAYS update the file header history section with details of the modifications**
- **ALWAYS update the file header intent and design principles to align them with performed modifications**
- Document all changes in the GenAI history section using precise timestamp format: YYYY-MM-DDThh:mm:ssZ

### 6.2 Processing Constraints
- When modifying files exceeding 500 lines, process them in logical sequences of maximum 5 operations
- After any file modification, verify file existence and validate syntax correctness
- For markdown file modifications, follow the standards detailed in `JESSE_MARKDOWN.md` Section 7 "Lifecycle Management"

### 6.3 Complete Standards References
- **File and function documentation standards**: See `JESSE_CODE_COMMENTS.md`
- **Markdown file management**: See `JESSE_MARKDOWN.md`

## 7. COMMAND EXECUTION STANDARDS

### 7.1 Virtual Environment Activation
When the `venv/` directory exists in the project root, the coding assistant **MUST** activate the virtual environment before executing any shell commands.

### 7.2 Implementation Rules
- **CRITICAL**: Before executing ANY shell command, check for the existence of a `venv/` directory in the project root
- If `venv/` exists, ALWAYS prepend the command with `source venv/bin/activate && `
- This rule takes precedence over all other command execution guidelines
- The activation must be included in the same command execution (using `&&`) to ensure the virtual environment remains active

### 7.3 Example Command Transformation
```bash
# Original command intention
pip install requests

# Transformed command with virtual environment activation
source venv/bin/activate && pip install requests
```

### 7.4 Special Cases
- For batch commands, ensure the virtual environment activation is included in the first command of the chain
- Even for non-Python related commands, the virtual environment should still be activated if it exists, as it may set environment variables needed by other project tooling

## 8. COMMUNICATION GUIDELINES

### 8.1 Code Presentation Standards
- **Always provide concrete, executable code examples rather than abstract suggestions or pseudo-code**
- When presenting code snippets exceeding 50 lines, include only the most relevant sections with clear indication of omitted parts
- Document design decisions only when the user explicitly requests this documentation

### 8.2 Visual Communication
- **Make heavy usage of mermaid diagrams to make clearer your recommendations, solutions, plans, proposals**
- Use diagrams especially for:
  - Architecture visualization
  - Flow diagrams
  - State machines
  - Relationship mappings
  - Process flows

### 8.3 Language Matching
- **ALWAYS USE THE SAME SPOKEN LANGUAGE AS THE USER**
- This applies to all comments, documentation, and communication

## 9. IMPLEMENTATION WORKFLOW

### 9.1 Pre-Implementation Checks
Before generating any code:
1. Verify alignment with project documentation
2. Check for existing similar implementations (DRY principle)
3. Confirm understanding of user requirements
4. Consider KISS approach options

### 9.2 During Implementation
While generating code:
1. Apply defensive error handling
2. Maintain documentation consistency
3. Follow file modification rules
4. Respect virtual environment requirements

### 9.3 Post-Implementation Verification
After generating code:
1. Verify syntax correctness
2. Confirm documentation updates
3. Check for DRY violations
4. Validate error handling implementation

## 10. ENFORCEMENT AND COMPLIANCE

### 10.1 Zero-Tolerance Policy
- Missing error handling is a **blocking issue**
- Documentation misalignment must be resolved before proceeding
- DRY violations require immediate refactoring
- KISS principle violations need justification or simplification

### 10.2 Compliance Verification Process
1. **Before generation**: Verify requirements and check existing patterns
2. **During generation**: Apply all standards consistently
3. **After generation**: Validate compliance with all rules
4. **Periodic review**: Ensure ongoing adherence to standards

### 10.3 Code Generation Debt Prevention
- Never accumulate technical debt through rushed implementations
- Fix standard violations immediately when discovered
- Refactor proactively when patterns emerge
- Treat code quality as important as functionality

## 11. GIT COMMIT WORKFLOW TRIGGER

### 11.1 Automatic Workflow Execution
⚠️ **CRITICAL**: When the user asks for 'git commit' or just 'commit', you MUST automatically execute the `/jesse_wip_task_commit.md` workflow.

### 11.2 Trigger Phrases
The following user requests MUST trigger the commit workflow:
- "git commit"
- "commit"
- "commit the changes"
- "make a commit"
- "create a commit"

### 11.3 Workflow Execution Rules
- **NEVER** execute a simple `git commit` command without following the complete workflow
- **ALWAYS** follow the comprehensive commit message standards defined in `/jesse_wip_task_commit.md`
- **MANDATORY** user confirmation step must be completed before any actual commit
- Apply all git command standards (including `-P` option) as defined in the workflow

## 12. BUG FIX CLAIM STANDARDS

### 12.1 Proof-Based Bug Fix Claims
⚠️ **CRITICAL**: You must NEVER claim that you have found a fix for a bug without concrete proof from a real test execution.

### 12.2 Required Evidence for Bug Fix Claims
- **Test Execution**: A bug fix claim is only valid after running actual tests that demonstrate the fix works
- **Observable Results**: Must have concrete output, logs, or test results showing the bug is resolved
- **Reproducibility**: The fix must be verified through repeatable test execution

### 12.3 Proper Communication About Potential Fixes
When you identify a potential bug fix without having tested it:
- **USE THIS LANGUAGE**: "I found a possible fix that needs to be validated"
- **NEVER SAY**: "I fixed the bug" or "This fixes the issue" without test proof
- **ALWAYS CLARIFY**: State explicitly that the fix is theoretical until proven by tests

### 12.4 Bug Fix Workflow
1. **Identify potential fix**: Analyze code and identify possible solution
2. **Communicate uncertainty**: State clearly it's a "possible fix requiring validation"
3. **Implement changes**: Apply the potential fix to the codebase
4. **Request testing**: Ask user to run tests or execute test commands yourself
5. **Verify results**: Only after seeing successful test results can you claim the bug is fixed

### 12.5 Examples of Proper Bug Fix Communication
- ✅ CORRECT: "I've identified a possible fix for the WebSocket connection issue. The changes need to be validated through testing."
- ✅ CORRECT: "I found what might be causing the error and implemented a potential fix. Let's run the tests to confirm it works."
- ❌ INCORRECT: "I fixed the bug in the authentication module."
- ❌ INCORRECT: "This should fix your issue" (without having tested)

---

**Remember**: This consolidated rule supersedes all previous scattered code generation rules. When in doubt, refer to this document as the authoritative source for all code generation standards.

---

# JESSE_HINTS.md - Critical AI Assistant Enforcement Rules

## 🚨 CRITICAL ENFORCEMENT RULE: USER IDENTITY FILE 🚨

### 📍 MANDATORY FILE LOCATION ENFORCEMENT

**JESSE_USER_IDENTITY.md LOCATION REQUIREMENTS - STRICTLY ENFORCED:**

- **✅ ONLY VALID LOCATION**: `${HOME}/Cline/Rules/JESSE_USER_IDENTITY.md`
- **❌ NEVER IN PROJECT REPOSITORY**: This file **MUST NEVER** be placed in any project directory
- **❌ NEVER IN .clinerules/**: This file **MUST NEVER** be placed in project-level installation  
- **❌ NEVER COMMITTED TO GIT**: Contains PII that would violate privacy if committed

### 🔐 PII PROTECTION REQUIREMENTS

**SECURITY ENFORCEMENT:**
- File contains Personally Identifiable Information (PII)
- Must remain exclusively in user's personal directory structure
- Framework MUST refuse to operate if file found in project repository
- AI assistant MUST display security violation warning if misplaced

### 📋 MANDATORY USER INFORMATION FIELDS (9 REQUIRED)

**AI ASSISTANT MUST INTERACTIVELY COLLECT ALL 9 FIELDS:**

1. **User Firstname**: [User's first name]
2. **User Lastname**: [User's last name] 
3. **User Corporate Login**: [Company username/login]
4. **User Job Description**: [Role/position, e.g., "Senior Software Engineer"]
5. **User Country**: [User's country]
6. **User Town**: [User's city/town]
7. **User Timezone**: [Timezone, e.g., Europe/Paris, America/New_York]
8. **User Company Name**: [Company name]
9. **User Company Corporate URL**: [Company website URL]

### 🤖 INSTALLATION BEHAVIOR ENFORCEMENT

**MANDATORY AI ASSISTANT ACTIONS:**

1. **File Existence Check**: Always check if `${HOME}/Cline/Rules/JESSE_USER_IDENTITY.md` exists
2. **Interactive Collection**: If missing, prompt for ALL 9 required fields above
3. **Completeness Verification**: If exists, verify all 9 fields are present
4. **Global Location Only**: Create file ONLY at `${HOME}/Cline/Rules/JESSE_USER_IDENTITY.md`
5. **Security Validation**: Confirm file creation at correct location, never in project

### 🛡️ AUTOMATIC PROTECTION REQUIREMENTS

**AI ASSISTANT MUST ADD .gitignore PROTECTION:**

```gitignore
# JESSE AI Framework - User Identity Protection
# 🚨 CRITICAL: This file contains PII and must NEVER be committed 🚨
JESSE_USER_IDENTITY.md
**/JESSE_USER_IDENTITY.md
.clinerules/JESSE_USER_IDENTITY.md
${HOME}/Cline/Rules/JESSE_USER_IDENTITY.md
```

### ⚠️ VIOLATION CONSEQUENCES

**IF JESSE_USER_IDENTITY.md FOUND IN PROJECT REPOSITORY:**
- Framework MUST refuse to operate
- Display immediate security violation warning
- Require immediate file relocation to global location
- Warn about potential privacy compromise

### 🚫 NON-NEGOTIABLE ENFORCEMENT

**THESE RULES HAVE NO EXCEPTIONS:**
- Security requirements cannot be bypassed
- Interactive collection cannot be skipped
- Global location requirement cannot be ignored
- PII protection measures cannot be disabled

---

## 🎯 AI ASSISTANT COMPLIANCE CHECKLIST

When installing JESSE AI Framework:

- [ ] Verified `${HOME}/Cline/Rules/JESSE_USER_IDENTITY.md` exists
- [ ] Confirmed all 9 required fields are present
- [ ] Ensured file is NOT in any project directory
- [ ] Added protective .gitignore patterns
- [ ] Validated security compliance before proceeding

**REMINDER**: These are mandatory security requirements, not suggestions. Framework operation depends on strict compliance with user identity protection rules.

---

## 🔧 CRITICAL ENFORCEMENT RULE: FEATURE LANGUAGE STANDARDS 🔧

### 📋 ESTABLISHED FUNCTIONALITY PRESENTATION

**MANDATORY LANGUAGE STANDARDS - STRICTLY ENFORCED:**

- **✅ PRESENT ALL FEATURES AS ESTABLISHED**: Treat implemented functionality as standard system behavior
- **❌ NEVER USE "NEW" LANGUAGE**: Avoid words like "new", "enhanced", "recently added", "upgraded"
- **❌ NEVER USE TEMPORAL REFERENCES**: Avoid "now includes", "has been improved", "latest addition"
- **❌ NEVER TREAT AS SPECIAL**: Don't present standard functionality as exceptional or noteworthy

### 🎯 AMAZON DOCUMENT EXCEPTION

**THIS RULE DOES NOT APPLY TO:**

- **Amazon PR/FAQ Documents**: PR/FAQ format specifically announces new features and capabilities
- **Working Backwards Documents**: Working Backwards methodology describes future/new functionality by design
- **Amazon-styled Product Announcements**: Documents following Amazon's product launch communication patterns

**EXCEPTION RATIONALE:**
These document types have specific purposes that inherently require "new feature" language as part of their standard format and communication objectives.

### 🎯 REQUIRED PRESENTATION APPROACH (For Non-Amazon Documents)

**AI ASSISTANT MUST PRESENT FEATURES AS:**

1. **Standard System Behavior**: "WIP tasks include Git branch management" (not "WIP tasks now include...")
2. **Core Functionality**: "The system validates Git repository state" (not "The new validation feature...")
3. **Established Workflow**: "Task completion handles branch merging" (not "Enhanced completion workflow...")
4. **Normal Operation**: "Users can switch between task branches" (not "Users can now switch...")

### 🚫 FORBIDDEN LANGUAGE PATTERNS (Outside Amazon Documents)

**THESE PHRASES ARE STRICTLY PROHIBITED:**

- "New feature", "New functionality", "New capability"
- "Enhanced", "Improved", "Upgraded", "Better"
- "Now includes", "Now supports", "Now provides"
- "Recently added", "Latest addition", "Just implemented"
- "Updated to include", "Has been enhanced with"

### ✅ CORRECT LANGUAGE PATTERNS (For Standard Documentation)

**USE THESE PRESENTATION APPROACHES:**

- "The system includes", "WIP tasks feature", "Workflows provide"
- "Standard functionality", "Core capability", "Built-in support"
- "Users can", "The workflow handles", "Tasks support"
- "Established behavior", "Normal operation", "Standard process"

### 🤖 ENFORCEMENT MECHANISMS

**AI ASSISTANT MUST:**

1. **Identify document type**: Determine if content is Amazon PR/FAQ or Working Backwards format
2. **Apply appropriate rules**: Use standard language for system documentation, allow "new" language for Amazon documents
3. **Review all responses** for temporal or enhancement language before sending (except Amazon documents)
4. **Reframe feature descriptions** to present as established functionality (in non-Amazon contexts)

### 💡 REASONING BEHIND THIS RULE

**WHY THIS MATTERS:**

- **User Confidence**: Users expect reliable, established functionality in system documentation
- **System Maturity**: Presents the framework as mature and stable
- **Clear Communication**: Avoids confusion about what's standard vs. experimental
- **Document Purpose**: Respects the specific communication objectives of different document types
- **Future-Proofing**: Prevents documentation from becoming outdated when features mature

### 🚫 NON-NEGOTIABLE ENFORCEMENT

**THIS RULE HAS NO EXCEPTIONS (Outside Amazon Documents):**
- Language standards cannot be bypassed for convenience
- All system documentation must use established functionality language
- AI assistant must self-correct before sending responses
- Consistency across all non-Amazon documentation is mandatory

---

## 🎯 AI ASSISTANT LANGUAGE COMPLIANCE CHECKLIST

Before sending any response about system functionality:

- [ ] Verified content is not Amazon PR/FAQ or Working Backwards format
- [ ] Removed all "new", "enhanced", "improved" language
- [ ] Presented features as standard system behavior
- [ ] Used established functionality presentation patterns
- [ ] Avoided temporal references to implementation timing

**REMINDER**: Present all implemented functionality as the normal, expected way the system operates, not as special additions or improvements.

---

## 🚨 CRITICAL ENFORCEMENT RULE: PORTABLE FILE PATH STANDARDS 🚨

### 📁 PATH PORTABILITY REQUIREMENTS

**PORTABLE FILE PATH STANDARDS - STRICTLY ENFORCED:**

- **✅ ALWAYS USE ${HOME} VARIABLE**: All file paths referencing user directories must use ${HOME} environment variable
- **❌ NEVER USE ABSOLUTE USER PATHS**: Prohibit hardcoded absolute paths containing user directories
- **❌ NEVER USE PLATFORM-SPECIFIC PATHS**: Avoid /home/username, /Users/username, C:\Users\username patterns
- **❌ NEVER HARDCODE USER NAMES**: Eliminate any hardcoded usernames in file paths

### 🛡️ ABSOLUTE PATH PROHIBITION

**FORBIDDEN PATH PATTERNS:**

- `/home/[username]/...` - Linux/Unix absolute user paths
- `/Users/[username]/...` - macOS absolute user paths  
- `C:\Users\[username]\...` - Windows absolute user paths
- Any path containing hardcoded usernames or user-specific directories
- **Examples of PROHIBITED patterns**:
  - `/home/jcjorel/Cline/Rules/...`
  - `/Users/johnsmith/Documents/...`
  - `C:\Users\admin\AppData\...`

### ✅ REQUIRED ${HOME} USAGE PATTERNS

**MANDATORY PORTABLE PATH FORMATS:**

- **Environment Variable**: `${HOME}/Cline/Rules/...`
- **Shell Variable**: `$HOME/.config/...`
- **Cross-Platform**: `~/Documents/...` (tilde expansion)
- **Documentation**: Always reference user directories via ${HOME}

**CORRECT EXAMPLES:**
- `${HOME}/Cline/Rules/JESSE_USER_IDENTITY.md`
- `${HOME}/.config/application/settings.json`
- `$HOME/Documents/project-files/`
- `~/workspace/repositories/`

### 📝 CODE AND DOCUMENTATION STANDARDS

**AI ASSISTANT MUST ENFORCE IN:**

1. **Documentation Files**: All .md files with file path references
2. **Configuration Files**: Shell scripts, config files, environment setups
3. **Code Comments**: Any file path references in code comments
4. **Installation Instructions**: Setup and installation documentation
5. **Workflow Files**: All workflow .md files with path specifications
6. **Environment Variables**: Configuration and setup scripts

### 🤖 ENFORCEMENT MECHANISMS

**AI ASSISTANT MUST:**

1. **Path Validation**: Scan all generated content for hardcoded user paths
2. **Automatic Conversion**: Replace absolute user paths with ${HOME} variable
3. **Pre-Generation Check**: Validate path portability before creating any content
4. **Cross-Reference Validation**: Ensure consistency across all related files
5. **Documentation Review**: Check existing files for non-portable path patterns

### ⚠️ VIOLATION CONSEQUENCES

**IF HARDCODED USER PATHS ARE DETECTED:**
- **Immediate Correction Required**: Stop and fix path before proceeding
- **File Review Mandate**: Audit all related files for similar violations
- **Consistency Enforcement**: Update all references to use portable format
- **Documentation Update**: Revise any affected documentation immediately

### 🌍 PORTABILITY BENEFITS

**WHY PORTABLE PATHS MATTER:**

- **Cross-User Compatibility**: Code works for any user without modification
- **System Portability**: Functions across Linux, macOS, and Windows systems
- **Documentation Clarity**: Instructions remain valid for all users
- **Maintenance Simplification**: Reduces user-specific customization requirements
- **Professional Standards**: Follows software development best practices

### 🚫 NON-NEGOTIABLE ENFORCEMENT

**THESE RULES HAVE NO EXCEPTIONS:**
- Path portability standards cannot be bypassed for convenience
- Hardcoded user paths must be eliminated immediately when detected
- ${HOME} variable usage is mandatory for all user directory references
- Cross-platform compatibility requirements cannot be ignored

---

## 🎯 AI ASSISTANT PATH PORTABILITY CHECKLIST

Before generating any content with file paths:

- [ ] Verified no hardcoded user directory paths exist
- [ ] Confirmed all user paths use ${HOME} or equivalent variables
- [ ] Checked cross-platform path compatibility
- [ ] Validated path portability across different users
- [ ] Ensured consistency with existing portable path standards

**REMINDER**: All file paths referencing user directories must use portable environment variables to ensure compatibility across different users and systems.

---

# Knowledge Management System

## System Directives

### Automatic Session Initialization - MANDATORY SYSTEM DIRECTIVE

**🚨 CRITICAL SYSTEM REQUIREMENT - NO EXCEPTIONS PERMITTED 🚨**

At the start of EVERY new [Cline](https://github.com/cline/cline) session, these steps are MANDATORY and MUST be executed BEFORE processing ANY user request. This is a non-negotiable system requirement that takes precedence over all other considerations:

#### MANDATORY EXECUTION SEQUENCE:
1. **MANDATORY STEP 1**: Read this file (JESSE_KNOWLEDGE_MANAGEMENT.md) completely to load system rules and essential knowledge
   - **VERIFICATION**: Confirm knowledge management rules are loaded
   - **FAILURE ACTION**: If this step fails, STOP and report system initialization error

2. **MANDATORY STEP 2**: Read `.knowledge/persistent-knowledge/KNOWLEDGE_BASE.md` for accumulated project knowledge
   - **VERIFICATION**: Confirm knowledge base content is loaded
   - **FAILURE ACTION**: If file doesn't exist, create it with basic structure

3. **MANDATORY STEP 3**: IF git clone or imported PDF references exist in .knowledge/persistent-knowledge/KNOWLEDGE_BASE.md, automatically load ALL corresponding `.knowledge/git-clones/[repo-name]_kb.md` and `.knowledge/pdf-knowledge/[PDF-name]_kb.md` files
   - **VERIFICATION**: Confirm all referenced git clone knowledge bases are loaded
   - **FAILURE ACTION**: Report missing knowledge base files

4. **MANDATORY STEP 4**: IF a current WIP task exists (as specified in the Essential Knowledge Base section), automatically load ONLY that task's files: `.knowledge/work-in-progress/[current_task]/WIP_TASK.md` and `.knowledge/work-in-progress/[current_task]/PROGRESS.md`
   - **IMPORTANT**: Load ONLY the current task, NOT other active tasks listed in "Other Active Tasks"
   - **VERIFICATION**: Confirm only the current WIP task context is loaded (unless explicitly disabled via `/jesse_wip_task_disable`)
   - **FAILURE ACTION**: Report WIP task loading issues

5. **MANDATORY STEP 5**: Display brief context summary including:
   - Current task status and available resources
   - Loaded knowledge bases count
   - Active WIP task status (if any)
   - Session initialization confirmation

6. **MANDATORY STEP 6**: Only after ALL above steps are completed successfully, proceed with user request processing

#### SESSION INITIALIZATION TRIGGERS:
- **New [Cline](https://github.com/cline/cline) conversation/chat session**
- **Fresh IDE restart with [Cline](https://github.com/cline/cline) activation**
- **Any context reset or session boundary**
- **Explicit user request for session reinitialization**

#### ENFORCEMENT MECHANISMS:
- **Self-Verification**: After each mandatory step, confirm successful completion
- **Error Reporting**: Any initialization failure must be immediately reported to user
- **No Bypass**: These steps cannot be skipped, deferred, or bypassed under any circumstances
- **Priority Override**: Session initialization takes absolute priority over user requests

#### COMPLIANCE VERIFICATION:
Before processing any user request, internally verify:
- [ ] Knowledge management rules loaded
- [ ] Essential knowledge base accessed
- [ ] Git clone knowledge bases loaded (if applicable)
- [ ] WIP task context loaded (if applicable and not disabled)
- [ ] Context summary provided to user
- [ ] All mandatory steps completed successfully

**FAILURE TO EXECUTE THIS MANDATORY SEQUENCE CONSTITUTES A CRITICAL SYSTEM ERROR**

### Session Initialization Enforcement Protocol

**IMMEDIATE COMPLIANCE CHECK**: If you are reading this file and have NOT executed the Mandatory Session Initialization sequence above, you MUST:

1. **STOP** processing any current user request immediately
2. **EXECUTE** the complete Mandatory Session Initialization sequence now
3. **REPORT** to the user: "Session initialization was incomplete. Executing mandatory knowledge loading sequence..."
4. **COMPLETE** all 6 mandatory steps before resuming any other activities
5. **CONFIRM** successful initialization with context summary

**SESSION BOUNDARY DETECTION**: A new session is detected when:
- No previous knowledge of Essential Knowledge Base content exists in current context
- No awareness of current WIP task status exists
- First interaction in a new [Cline](https://github.com/cline/cline) conversation thread
- Context has been reset or cleared

**SELF-ENFORCEMENT MECHANISM**: Every time this knowledge management file is accessed:
1. Verify that session initialization has been completed
2. If not completed, immediately execute the mandatory sequence
3. Document the initialization in your response to the user
4. Never proceed with user requests until initialization is verified complete

**CRITICAL REMINDER**: This is not a suggestion or best practice - it is a mandatory system requirement that cannot be bypassed, deferred, or ignored under any circumstances.

## Installation Location and Preferences

### Preferred Installation Location
**JESSE_*.md files and associated workflows SHOULD preferably be installed in `${USER_HOME_DIR}/Cline/Rules/` and `${USER_HOME_DIR}/Cline/Workflows/` respectively** to make them permanent and available across all projects. This ensures consistent behavior and rule enforcement regardless of the specific project being worked on.

### Installation Process Requirements
**CRITICAL**: At installation time of these files, **YOU MUST** ask the user what to do with the following exact options:

1. **OPTION 1 - PREFERRED LOCATION**: Install JESSE_*.md files at `${USER_HOME_DIR}/Cline/Rules/` and workflows at `${USER_HOME_DIR}/Cline/Workflows/`
2. **OPTION 2 - PROJECT LEVEL**: Install files at project level in `<project_root>/.clinerules/` and `<project_root>/.clinerules/workflows/`

### Location-Specific Behavior

#### When Installed at Preferred Location (${USER_HOME_DIR}/Cline/)
- **Global Rules**: All JESSE_*.md files remain in their installed state at `${USER_HOME_DIR}/Cline/Rules/`
- **Project-Specific Knowledge**: `<project_root>/.clinerules/JESSE_KNOWLEDGE_MANAGEMENT.md` contains **ONLY** project-related information:
  - Essential Knowledge Base section
  - Project-specific context
  - Current and active WIP tasks
  - Project quick access links
- **File Separation**: The global `${USER_HOME_DIR}/Cline/Rules/JESSE_KNOWLEDGE_MANAGEMENT.md` remains unchanged from installation time, containing only the system directives and operational frameworks

#### When Installed at Project Level (<project_root>/.clinerules/)
- **Self-Contained**: All JESSE_*.md files and workflows remain within the project directory
- **Complete Functionality**: The project-level `JESSE_KNOWLEDGE_MANAGEMENT.md` contains both system directives AND project-specific information
- **Project Isolation**: Rules and knowledge management are contained within the specific project scope

### File Management After Installation

#### Preferred Location Installation Protocol
1. **System Files**: JESSE_*.md files installed at `${USER_HOME_DIR}/Cline/Rules/` are never modified after installation
2. **Project Knowledge File**: Create `<project_root>/.clinerules/JESSE_KNOWLEDGE_MANAGEMENT.md` containing:
   ```markdown
   # Project Knowledge Management
   *This file contains project-specific knowledge while system rules remain at ${USER_HOME_DIR}/Cline/Rules/*
   
   # Essential Knowledge Base
   [Project-specific content only]
   ```
3. **Workflow Access**: Workflows at `${USER_HOME_DIR}/Cline/Workflows/` remain globally accessible
4. **Consistency**: Project knowledge file follows same structure as global file but contains only project-related sections

#### Installation Verification
After installation, verify:
- [ ] User choice was explicitly requested and confirmed
- [ ] Files are installed at chosen location
- [ ] If preferred location: project knowledge file created with appropriate content separation at `<project_root>/.clinerules/JESSE_KNOWLEDGE_MANAGEMENT.md`
- [ ] All workflow references remain functional regardless of installation location

#### Critical File Location Reminder
**IMPORTANT**: When using global deployment (`${USER_HOME_DIR}/Cline/Rules/`), the project-specific knowledge file must ALWAYS be created at:
- ✅ **CORRECT**: `<project_root>/.clinerules/JESSE_KNOWLEDGE_MANAGEMENT.md`
- ❌ **INCORRECT**: `<project_root>/JESSE_KNOWLEDGE_MANAGEMENT.md` (this is the root cause of common installation errors)

This ensures proper project isolation and prevents conflicts with global framework rules.

### Knowledge Capture Rules
- **Automatic Capture**: When user says "remember this", "capture this knowledge", or similar phrases, automatically append structured information to appropriate knowledge files
- **Intemporal Writing**: All knowledge entries must be written in present tense, stating facts rather than referencing past implementations
- **Consistency Maintenance**: Essential Knowledge Base and WIP Task learnings must never contradict each other
- **Single Source of Truth**: Each piece of knowledge has consistent representation across all knowledge files
- **External Knowledge Auto-Capture**: Knowledge gathered through Perplexity MCP server and direct Web Browsing must be **AUTOMATICALLY** captured:
  - **If active WIP task exists**: Append knowledge to `.knowledge/work-in-progress/[current_task]/WIP_TASK.md`
  - **If no active task**: Append knowledge to `.knowledge/persistent-knowledge/KNOWLEDGE_BASE.md`
  - **No manual trigger required**: This capture happens automatically whenever external knowledge is retrieved
- **Test Result Auto-Update**: When executing any test, automatically update the current WIP task's PROGRESS.md file with test results:
  - **If active WIP task exists**: Update `.knowledge/work-in-progress/[current_task]/PROGRESS.md` with test outcome, timestamp, and relevant details
  - **Include both successful and failed test results**: Document what was tested, the result, and any significant findings or error messages
  - **Overwrite previous results**: Replace any existing test status and context for the same test rather than accumulating multiple entries
  - **Automatic execution**: This update happens automatically whenever tests are run, no manual trigger required
  - **If no active WIP task**: Test results are not automatically captured (focus on current task context)
  - **Standardized logging format**: Use this exact format for test result entries in PROGRESS.md:
    ```
    ## Test Status: [Test Name/Description]
    **Status**: ✅ PASSED | ❌ FAILED | 🔄 RUNNING | ⏸️ SKIPPED
    **Timestamp**: YYYY-MM-DDThh:mm:ssZ
    **Test Command**: [exact command executed]
    **Result Summary**: [brief outcome description]
    **Details**: [relevant findings, error messages, or significant observations]
    **Context**: [any additional context relevant to debugging or understanding]
    ```

### Current vs. Other Active Tasks Policy
- **Current WIP Task**: The single task currently being worked on, loaded automatically at session start
- **Other Active Tasks**: Tasks that exist but are NOT the current focus, these are NOT loaded automatically
- **Task Switching**: Use `/jesse_wip_task_switch.md` workflow to change which task is current
- **Single Task Focus**: Only one WIP task can be "current" at any time to maintain clear context

### Git Branch Integration Policy
**CRITICAL**: WIP tasks include comprehensive Git branch management integration:

#### Git Branch Tracking
- **All WIP tasks track their associated Git branch** in WIP_TASK.md Git Integration section
- **Branch information includes**: Branch name, parent branch, creation timestamp, and status
- **Branch status values**: Active, Merged, Deleted
- **Branch naming convention**: Proposed format `jesse-wip/[task_name]` but user can customize

#### Git Safety Requirements
- **Clean Working Directory Prerequisite**: ALL WIP task operations require clean Git working directory
  - **Task Creation**: Cannot create WIP task with uncommitted changes
  - **Task Switching**: Cannot switch WIP tasks with uncommitted changes  
  - **Task Completion**: Git operations require clean state for merge assistance
- **Mandatory Commit Flow**: WIP task files must be committed before Git branch operations
- **Branch Isolation**: Each WIP task can have its own dedicated Git branch for work isolation

#### Git Branch Management Features
- **Task Creation**: Offers branch creation with parent branch selection and custom naming
- **Task Switching**: Automatic Git branch switching when tasks use different branches
- **Task Completion**: Comprehensive merge assistance with multiple merge strategies:
  - Fast-Forward Merge (clean linear history)
  - Three-Way Merge (preserves branch context)
  - Squash and Merge (single commit for feature)
  - Rebase and Merge (clean linear history with individual commits)
- **Branch Cleanup**: Explicit user choice for branch deletion after merge

#### Multiple Tasks Branch Conflict Management
- **Same Branch Detection**: System detects when multiple WIP tasks share the same branch
- **Manual Management Warning**: Users warned about manual Git management requirements
- **Branch Deletion Restrictions**: Automatic branch operations disabled when multiple tasks share branch
- **User Guidance**: Clear explanations provided for complex Git scenarios

#### Git Repository Validation
- **Repository Detection**: All workflows validate Git repository presence before offering Git features
- **Fallback Behavior**: WIP tasks function normally in non-Git environments
- **Error Handling**: Comprehensive Git operation failure recovery with clear user guidance

### Git Clone Storage Policy
**CRITICAL**: All git clones are stored **EXCLUSIVELY** in `<project_root>/.knowledge/git-clones/` directory.

- **Single Location Rule**: Git clones must **NEVER** exist anywhere else in the project structure
- **No Exceptions**: This policy has no exceptions - all external repositories are cloned only to `.knowledge/git-clones/`
- **Centralized Management**: This ensures consistent knowledge management and prevents scattered repository copies
- **Version Control Separation**: Keeps external repository content separate from project codebase through .gitignore rules

### Large File Processing Protocol
When attempting to access files from git clones (which are exclusively located in `.knowledge/git-clones/`):
1. Check if file is documented in corresponding `[repo-name]_kb.md`
2. If not documented and file exceeds 4000 lines:
   - Mark file in `KNOWLEDGE_BASE.md` as requiring processing with priority "**before any other tasks**"
   - Warn user about context window limitations
   - Recommend dedicated processing session using `/jesse_wip_task_process_large_file.md`

### Git Clone .gitignore Requirements
When any git clone is added to the knowledge base, the `<project_root>/.gitignore` file MUST contain these exact rules:

```
# Knowledge Management System - Git Clones
# Ignore actual git clone directories but keep knowledge base files
.knowledge/git-clones/*/
!.knowledge/git-clones/*.md
!.knowledge/git-clones/README.md
```

This ensures that:
- Actual git clone directories are ignored and not committed to the project repository
- Knowledge base files (`[repo-name]_kb.md`) are preserved and version controlled
- The git clones index file (`README.md`) is maintained in version control
- External repository content remains separate from project codebase

This `.gitignore` configuration enforces the exclusive storage policy by ensuring that only the centralized `.knowledge/git-clones/` location is managed for git clone content.

## Operational Modes Integration

### ACT Mode Enhancement
- Knowledge capture operates seamlessly during implementation
- Automatic context loading does not interrupt task execution
- WIP task progress updates occur after significant milestones

### PLAN Mode Enhancement
- WIP task creation automatically triggers PLAN mode for complex tasks
- Knowledge base consultation informs planning decisions
- Task scope and success criteria benefit from accumulated learnings

### DESIGN Mode Enhancement
- Knowledge base provides historical context for design decisions
- WIP tasks can reference design documentation
- Captured patterns inform architectural choices

## Workflow Commands

Users can invoke knowledge management workflows using `/[workflow-name].md` syntax:

### Core Workflows
- `/jesse_wip_task_create.md` - Create new Work-in-Progress task
- `/jesse_wip_task_switch.md` - Switch between existing WIP tasks
- `/jesse_wip_task_complete.md` - Complete current WIP task and extract learnings
- `/jesse_wip_task_archive.md` - Archive WIP task without completion processing
- `/jesse_wip_task_capture_knowledge.md` - Capture and structure knowledge
- `/jesse_wip_kb_git_clone_import.md` - Add external git repository to knowledge base
- `/jesse_wip_task_check_consistency.md` - Verify knowledge consistency
- `/jesse_wip_task_process_large_file.md` - Process large files from git clones
- `/jesse_wip_task_disable.md` - Temporarily disable WIP task auto-loading for current session
- `/jesse_wip_kb_pdf_import.md` - Import and index PDF documents with LLM-based understanding

### Workflow Execution Rules
- Workflows operate in current operational mode unless explicitly specified
- Knowledge updates maintain consistency across all related files
- Workflow completion includes verification of knowledge integrity
- Failed workflows must restore previous consistent state

---

# Essential Knowledge Base
*Last Updated: 2025-06-21T23:20:00Z*

## Current Work-in-Progress Task
**Active Task**: None
**Status**: None
**Last Updated**: YYYY-MM-DDThh:mm:ssZ
**Phase**: None
**Next Action**: "Define a current WIP task"

## Other Active Tasks
*Note: These tasks exist but are NOT loaded automatically. Use /jesse_wip_task_switch to make one current.*
- None currently active

## Recently Completed
- `audio_device_management` - Completed 2025-06-21T23:20:00Z, archived with full knowledge extraction

## Quick Access Links
- [Persistent Knowledge Base](.knowledge/persistent-knowledge/KNOWLEDGE_BASE.md)
- [WIP Tasks Directory](.knowledge/work-in-progress/)
- [Git Clones Directory](.knowledge/git-clones/)

## Project Context
This project (nova-sonic-ui) appears to be a speech-to-text application with AWS integration, featuring a Nova Sonic speech processing backend and comprehensive testing infrastructure.

## Key Project Components
- **Backend Services**: FastAPI-based backend with AWS Nova Sonic integration
- **Audio Processing**: WebM/Opus audio format handling with streaming capabilities
- **Testing Framework**: Comprehensive test suite with CLI tools and performance benchmarks
- **Documentation**: Extensive API and architecture documentation
- **Development Tools**: Docker containerization and debugging scripts

---

# JESSE_MARKDOWN.md - Consolidated Markdown Management Standards

This file consolidates ALL markdown file management rules for the project, serving as the single source of truth for markdown creation, formatting, naming, and lifecycle management standards.

## 1. CRITICAL FOUNDATION RULES

### 1.1 Non-Negotiable Markdown Standards
⚠️ **CRITICAL**: All markdown file management MUST follow these consolidated standards. **NO EXCEPTIONS PERMITTED**. This is a non-negotiable project standard that takes precedence over scattered individual rules.

### 1.2 Universal Application Policy
- These standards apply to ALL markdown files without exception
- File purpose, size, or complexity are NOT valid exceptions
- Consistency across all markdown operations is mandatory

## 2. MARKDOWN FILE NAMING STANDARDS

### 2.1 UPPERCASE_SNAKE_CASE Requirement
- **ALL markdown files MUST use UPPERCASE_SNAKE_CASE naming format**
- Examples: `DESIGN.md`, `DATA_MODEL.md`, `README.md`, `API_DOCUMENTATION.md`
- No exceptions for any markdown file type

### 2.2 Specific File Naming Patterns
- Chat capture files: `<date as YYYYMMDD-HHmm>-<Chat_topic_in_snake_case>.md`
- Implementation plan files: `plan_{subtask_name}.md`
- Progress tracking files: `plan_progress.md`
- Overview files: `plan_overview.md`

## 3. GENERAL MARKDOWN STANDARDS

### 3.1 Mermaid Diagram Usage
- **Markdown files will heavily use mermaid diagrams to ease understanding by user**
- Use mermaid diagrams to make clearer recommendations, solutions, plans, proposals
- Prioritize visual clarity through diagrams over text-only explanations

### 3.2 Cross-References and Content Management
- **Implement cross-references with direct links between related documentation files rather than duplicating content**
- Documentation files must avoid duplicating information that already exists in other documentation files
- Establish single sources of truth for information that appears in multiple places
- Use direct file links with relative paths when referencing other documentation

### 3.3 Content Duplication Prevention
- **Prevent information duplication across documentation files**
- Use cross-references between documents instead of copying content
- Maintain consistency across all related documents
- Update all cross-referenced documents when making changes

## 4. SPECIALIZED MARKDOWN FILES

### 4.1 DESIGN_DECISIONS.md Files
- **All DESIGN_DECISIONS.md files must follow the pattern of adding newest entries at the top of the file**
- Sort entries from newest to oldest (top to bottom)
- This content must be periodically integrated into appropriate core documentation files
- If any design decision directly contradicts core documentation, update that core file immediately

### 4.2 Chat Capture Files
Chat capture functionality is handled by the dedicated workflow in `.clinerules/workflows/jesse_capture_our_chat.md`. Key requirements:
- **Location**: `<project_root>/.coding_assistant/captured_chats/<date as YYYYMMDD-HHmm>-<Chat_topic_in_snake_case>.md`
- **Naming pattern**: Date format must be YYYYMMDD-HHmm followed by topic in snake_case
- **Complete workflow**: See `.clinerules/workflows/jesse_capture_our_chat.md` for full implementation details

### 4.3 Implementation Plan Files
- Created in scratchpad directory during complex implementations
- Follow naming pattern: `<project_root>/scratchpad/<implementation_plan_name_in_lower_snake_case>/plan_{subtask_name}.md`
- Include direct links to all relevant documentation with brief context summaries
- Break large plans into multiple files to prevent context window truncation
- For complete scratchpad file standards, see `JESSE_SCRATCHPAD.md`

## 5. READING AND PROCESSING RULES

### 5.1 Captured Chats Absolute Exclusion
- **NEVER NEVER NEVER read files in `<project_root>/.coding_assistant/captured_chats/` as they are always out of context files**
- This is an absolute prohibition with no exceptions
- Captured chat files are ephemeral working documents, not authoritative sources
- Never consider captured chat files as sources of truth for any purpose

### 5.2 Context Window Management
- Prioritize reading current relevant documentation over historical markdown files
- Balance comprehensive documentation reading with context window constraints

## 6. LIFECYCLE MANAGEMENT

### 6.1 Creation Rules
- Apply naming standards immediately upon file creation
- Follow specialized file patterns for specific markdown types

### 6.2 Verification Procedures
- After any markdown file modification, verify file existence and validate syntax correctness
- Check that cross-references remain valid after changes
- Ensure consistency across all related markdown documents

## 7. ENFORCEMENT AND COMPLIANCE

### 7.1 Zero-Tolerance Policy
- Incorrect naming format must be fixed before proceeding
- Documentation quality is as important as content accuracy

### 7.2 Compliance Verification Process
1. **Before creating**: Verify naming standards
2. **During modification**: Maintain cross-references
3. **After changes**: Confirm file integrity
4. **Periodic audit**: Ensure ongoing compliance with all standards

### 7.3 Documentation Debt Prevention
- Never accumulate markdown management debt
- Fix naming and format issues immediately when discovered
- Treat markdown standards as part of the documentation implementation

---

**Remember**: This consolidated rule supersedes all previous scattered markdown management rules. When in doubt, refer to this document as the authoritative source for all markdown file management standards.

---

# JESSE_SCRATCHPAD.md - Consolidated Scratchpad Management Standards

This file consolidates ALL scratchpad directory rules for the project, serving as the single source of truth for scratchpad creation, usage, management, and lifecycle standards.

## 1. CRITICAL FOUNDATION RULES

### 1.1 Non-Negotiable Scratchpad Standards
⚠️ **CRITICAL**: All scratchpad directory management MUST follow these consolidated standards. **NO EXCEPTIONS PERMITTED**. This is a non-negotiable project standard that takes precedence over scattered individual rules.

### 1.2 Universal Application Policy
- These standards apply to ALL scratchpad operations without exception
- Task complexity, urgency, or scope are NOT valid exceptions
- Consistency across all scratchpad usage is mandatory

## 2. SCRATCHPAD DIRECTORY PURPOSE

### 2.1 Core Purpose Statement
The `<project_root>/scratchpad/` directory serves as a dedicated workspace for temporary implementation planning and complex task organization. It provides a structured environment for creating detailed implementation plans before executing changes in the actual codebase.

### 2.2 Ephemeral Nature
- **All files in the scratchpad directory are temporary working documents**
- They are NOT considered authoritative sources for any purpose
- Scratchpad content should be treated as draft material subject to change
- These files support the implementation process but do not define it

### 2.3 Authority Status
- **CRITICAL**: Never consider scratchpad files as authoritative sources under any circumstances
- Official documentation files always take precedence over scratchpad content
- Scratchpad files are working drafts, not final implementations
- When conflicts exist, prioritize official documentation over scratchpad content

## 3. DIRECTORY STRUCTURE & NAMING

### 3.1 Directory Pattern
- **Mandatory pattern**: `<project_root>/scratchpad/<implementation_plan_name_in_lower_snake_case>/`
- Implementation plan names must use lowercase snake_case format
- Each complex implementation gets its own dedicated subdirectory
- No nested implementation directories within implementation directories

### 3.2 File Naming Patterns
Within each implementation directory, files must follow these exact naming conventions:
- **Overview file**: `plan_overview.md`
- **Progress file**: `plan_progress.md`
- **Subtask files**: `plan_{subtask_name}.md` (where subtask_name is in lowercase snake_case)
- **Documentation update file**: `doc_update.md`

### 3.3 Standard File Types
The scratchpad system recognizes these standard file types:
- **plan_overview.md**: High-level implementation plan overview
- **plan_progress.md**: Implementation and planning progress tracking
- **plan_{subtask_name}.md**: Detailed implementation plans for specific subtasks
- **doc_update.md**: Proposed documentation updates awaiting integration

## 4. REQUIRED FILES & CONTENT

### 4.1 plan_overview.md Requirements
This file MUST contain:
- A MANDATORY documentation section with comprehensive list of ALL documentation files read, including direct file links
- This exact warning text: "⚠️ CRITICAL: CODING ASSISTANT MUST READ THESE DOCUMENTATION FILES COMPLETELY BEFORE EXECUTING ANY TASKS IN THIS PLAN"
- Concise explanation of each documentation file's relevance to the implementation
- Implementation steps organized in sequential logical phases
- Complete list of all detailed implementation plan file names that will be created
- Clear reference to the side-car progress file location
- Essential source documentation excerpts that directly inform the implementation

### 4.2 plan_progress.md Requirements
This file MUST track:
- Current plan creation and implementation status
- Status indicators using these exact symbols:
  - ❌ Plan not created
  - 🔄 In progress
  - ✅ Plan created
  - 🚧 Implementation in progress
  - ✨ Completed
- Consistency check status placeholder (with symbol ❌)
- Each specific subtask with its corresponding implementation plan file

### 4.3 plan_{subtask_name}.md Requirements
Each subtask file MUST include:
- Direct links to all relevant documentation with brief context summaries for each link
- Detailed step-by-step implementation instructions
- Specific code changes or additions required
- Expected outcomes and validation criteria
- Dependencies on other subtasks (if any)

### 4.4 doc_update.md Requirements
When complex documentation changes are needed:
- Create this file for proposed documentation updates
- Include precise file locations and exact content changes
- Organize updates by target documentation file
- Provide rationale for each documentation change

## 5. IMPLEMENTATION WORKFLOW

### 5.1 When to Create Scratchpad Directories
Scratchpad directories are created for:
- **Complex changes**: Multiple files, new components, architectural changes
- **Tasks meeting complexity criteria**:
  - Changes required across 3+ files
  - Creation of new architectural components
  - Database schema modifications
  - Implementation exceeding 100 lines of code
- **Explicitly requested implementation plans**
- **Documentation-heavy updates requiring staging**

### 5.2 Creation Process
1. **Think deeply about the plan** and interact with user to remove ambiguities
2. Create directory using the pattern: `<project_root>/scratchpad/<implementation_plan_name_in_lower_snake_case>/`
3. Create `plan_overview.md` with all required sections
4. Create `plan_progress.md` with initial status indicators
5. Create detailed implementation plans (`plan_{subtask_name}.md`) one at a time
6. Update progress file before starting work on each new plan file
7. Halt plan creation gracefully when context window token usage reaches 80% capacity

### 5.3 Update Process
When updating scratchpad files:
- Update the progress file immediately before and after each task
- Maintain consistency between overview and detailed plans
- Document any implementation failures with specific error details
- Keep status indicators current and accurate

### 5.4 Completion Process
1. Ask the user to perform comprehensive consistency check from a new session
2. Review all generated plan files against source documentation
3. Mark progress file with ✨ symbol to confirm completion
4. Implementation proceeds in a fresh session following the plan

## 6. ACCESS & REFERENCE RULES

### 6.1 Access Restrictions
- **Do not access scratchpad files unless explicitly requested by the user or when creating implementation plans**
- Scratchpad reading should be intentional and task-specific
- Avoid browsing scratchpad directories without clear purpose

### 6.2 Reference Prohibitions
- **NEVER reference scratchpad documents in file header dependencies**
- Code comments must not reference scratchpad files
- Documentation must not link to scratchpad content
- Dependencies sections must explicitly exclude scratchpad references

### 6.3 Reading Guidelines
When reading scratchpad files:
- Always verify if content is still relevant to current task
- Check progress indicators before relying on plan content
- Confirm plans haven't been superseded by actual implementation
- Use scratchpad content as guidance, not gospel

## 7. LIFECYCLE MANAGEMENT

### 7.1 Creation Phase
- Scratchpad directories are created at the start of complex implementations
- All required files must be created before implementation begins
- Progress tracking starts immediately upon directory creation

### 7.2 Active Phase
- Plans are actively updated during implementation
- Progress indicators reflect real-time status
- New subtask files can be added as needed
- Existing files are updated to reflect learnings

### 7.3 Completion Phase
- Completed implementations should be marked with ✨ in progress file
- Scratchpad files remain as historical reference
- No automatic deletion of completed scratchpad directories

### 7.4 Archival Considerations
- Scratchpad directories are not automatically cleaned up
- Manual cleanup may be performed periodically
- Completed plans serve as implementation history
- Archive valuable patterns for future reference

## 8. ENFORCEMENT AND COMPLIANCE

### 8.1 Zero-Tolerance Policy
- Missing required files in scratchpad directories is a **blocking issue**
- Incorrect naming patterns must be fixed before proceeding
- Status indicators must be kept current
- Reference prohibitions are absolute

### 8.2 Compliance Verification Process
1. **Before creating**: Verify complexity criteria are met
2. **During creation**: Follow exact directory and file patterns
3. **During implementation**: Maintain accurate progress tracking
4. **After completion**: Ensure all status indicators are final

### 8.3 Quality Standards
- Scratchpad documentation quality must match production documentation
- Plans must be detailed enough for implementation in fresh sessions
- Progress tracking must be accurate and timely
- All links and references must be valid

### 8.4 Common Violations to Avoid
- Creating scratchpad files without proper directory structure
- Referencing scratchpad files in production code or documentation
- Leaving progress indicators in inconsistent states
- Creating implementation plans for simple tasks
- Treating scratchpad content as authoritative

---

**Remember**: This consolidated rule supersedes all previous scattered scratchpad-related rules. When in doubt, refer to this document as the authoritative source for all scratchpad directory management standards.