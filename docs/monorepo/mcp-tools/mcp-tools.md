---
title: "VS Code Tools Documentation"
description: "A comprehensive, categorized list of tools available to AI models within the VS Code environment, including built-in tools and those provided by extensions."
author: "EmperorRAG"
last_updated: "2025-10-07"
version: "1.2"
schema_version: "1.0.0"
license: "MIT"
tags:
  - "VS Code"
  - "Tools"
  - "AI"
  - "Documentation"
  - "Copilot"
  - "MCP"
audience: "AI Language Models, Developers"
summary: "This document serves as a definitive guide to the tools accessible within the Visual Studio Code environment. It categorizes tools into logical groups, providing metadata such as tool counts and problem-solving roles for each tool to give AI models a structured overview of the available capabilities."
environment_constraints:
  tool_limit: 125
  reason: "Performance and context management for the AI model."
table_of_contents:
  - category: "VS Code Built-in Tools"
    tool_count: 39
    description: "Natively provided tools fundamental for interacting with the editor and workspace."
    subcategories:
      - name: "File System"
        tool_count: 7
      - name: "Search"
        tool_count: 4
      - name: "Jupyter Notebook"
        tool_count: 5
      - name: "Workspace & Project"
        tool_count: 3
      - name: "Web"
        tool_count: 2
      - name: "Git & SCM"
        tool_count: 1
      - name: "VS Code Internals"
        tool_count: 5
      - name: "Code Analysis"
        tool_count: 1
      - name: "GitHub"
        tool_count: 4
      - name: "Terminal"
        tool_count: 4
      - name: "Testing"
        tool_count: 2
      - name: "Task Management"
        tool_count: 1
  - category: "Context7 Library Documentation"
    tool_count: 2
    description: "Tools for fetching library and package documentation."
  - category: "MCP GitHub"
    tool_count: 85
    description: "A comprehensive suite of tools for interacting with the GitHub platform."
  - category: "Awesome Copilot"
    tool_count: 4
    description: "Tools for managing and searching custom instructions and collections."
  - category: "Nx"
    tool_count: 17
    description: "Tools for interacting with an Nx monorepo and Nx Cloud."
  - category: "GitKraken"
    tool_count: 19
    description: "Tools for Git operations and interacting with GitKraken services."
  - category: "Console Ninja (Runtime Debugging)"
    tool_count: 4
    description: "Tools for accessing runtime logs and errors."
  - category: "Prisma (Database)"
    tool_count: 6
    description: "Tools for managing a Prisma-based database schema and data."
  - category: "Tool Activation"
    tool_count: 31
    description: "Tools that activate specific toolsets to manage context and discoverability."
---

This document provides a comprehensive list of all the tools available in VS Code, grouped by their respective categories.

## VS Code Built-in Tools

These tools are natively provided by Visual Studio Code and are fundamental for interacting with the editor, workspace, and core functionalities. They are available to AI models for performing a wide range of tasks without requiring any external extensions.

### File System

- **`create_directory`**
  - **Description**: Create a new directory structure in the workspace.
  - **Role**: `File & Code Generation`
- **`create_file`**
  - **Description**: Create a new file in the workspace.
  - **Role**: `File & Code Generation`
- **`edit_files`**
  - **Description**: (Placeholder) A tool for editing files.
  - **Role**: `Code Editing & Refactoring`
- **`insert_edit_into_file`**
  - **Description**: Insert new code into an existing file.
  - **Role**: `Code Editing & Refactoring`
- **`list_dir`**
  - **Description**: List the contents of a directory.
  - **Role**: `Information Retrieval & Search`
- **`read_file`**
  - **Description**: Read the contents of a file.
  - **Role**: `Information Retrieval & Search`
- **`replace_string_in_file`**
  - **Description**: Make edits in an existing file.
  - **Role**: `Code Editing & Refactoring`

### Search

- **`file_search`**
  - **Description**: Search for files in the workspace by glob pattern.
  - **Role**: `Information Retrieval & Search`
- **`get_search_view_results`**
  - **Description**: Get the results from the search view.
  - **Role**: `Information Retrieval & Search`
- **`grep_search`**
  - **Description**: Do a fast text search in the workspace.
  - **Role**: `Information Retrieval & Search`
- **`semantic_search`**
  - **Description**: Run a natural language search for relevant code or documentation comments.
  - **Role**: `Information Retrieval & Search`

### Jupyter Notebook

- **`create_new_jupyter_notebook`**
  - **Description**: Generate a new Jupyter Notebook.
  - **Role**: `File & Code Generation`
- **`copilot_getNotebookSummary`**
  - **Description**: Get the summary of a notebook.
  - **Role**: `Information Retrieval & Search`
- **`edit_notebook_file`**
  - **Description**: Edit an existing Notebook file.
  - **Role**: `Code Editing & Refactoring`
- **`read_notebook_cell_output`**
  - **Description**: Retrieve the output for a notebook cell.
  - **Role**: `Debugging & Analysis`
- **`run_notebook_cell`**
  - **Description**: Run a code cell in a notebook file.
  - **Role**: `Execution & Automation`

### Workspace & Project

- **`create_and_run_task`**
  - **Description**: Create and run a build, run, or custom task for the workspace.
  - **Role**: `Execution & Automation`
- **`create_new_workspace`**
  - **Description**: Get comprehensive setup steps to create complete project structures.
  - **Role**: `Project & Workspace Management`
- **`get_project_setup_info`**
  - **Description**: Provides project setup information for a VS Code workspace.
  - **Role**: `Project & Workspace Management`

### Web

- **`fetch_webpage`**
  - **Description**: Fetch the main content from a web page.
  - **Role**: `Information Retrieval & Search`
- **`open_simple_browser`**
  - **Description**: Preview a website or open a URL in the editor's Simple Browser.
  - **Role**: `Execution & Automation`

### Git & SCM

- **`get_changed_files`**
  - **Description**: Get git diffs of current file changes in a git repository.
  - **Role**: `Version Control & SCM`

### VS Code Internals

- **`get_errors`**
  - **Description**: Get any compile or lint errors in a specific file or across all files.
  - **Role**: `Debugging & Analysis`
- **`get_vscode_api`**
  - **Description**: Get comprehensive VS Code API documentation and references.
  - **Role**: `Documentation & Metadata`
- **`install_extension`**
  - **Description**: Install an extension in VS Code.
  - **Role**: `Tool & Environment Management`
- **`run_vscode_command`**
  - **Description**: Run a command in VS Code.
  - **Role**: `Execution & Automation`
- **`vscode_searchExtensions_internal`**
  - **Description**: Browse the Visual Studio Code Extensions Marketplace.
  - **Role**: `Tool & Environment Management`

### Code Analysis

- **`list_code_usages`**
  - **Description**: List all usages of a function, class, method, variable, etc.
  - **Role**: `Debugging & Analysis`

### GitHub

- **`github_pull_request_activePullRequest`**
  - **Description**: Get comprehensive information about the active GitHub pull request.
  - **Role**: `Version Control & SCM`
- **`github_pull_request_copilot_coding_agent`**
  - **Description**: Completes a task using an asynchronous coding agent.
  - **Role**: `Execution & Automation`
- **`github_pull_request_openPullRequest`**
  - **Description**: Get comprehensive information about the open GitHub pull request.
  - **Role**: `Version Control & SCM`
- **`github_repo`**
  - **Description**: Search a GitHub repository for relevant source code snippets.
  - **Role**: `Information Retrieval & Search`

### Terminal

- **`get_terminal_output`**
  - **Description**: Get the output of a terminal command previously started.
  - **Role**: `Execution & Automation`
- **`run_in_terminal`**
  - **Description**: Execute shell commands in a persistent terminal session.
  - **Role**: `Execution & Automation`
- **`terminal_last_command`**
  - **Description**: Get the last command run in the active terminal.
  - **Role**: `Debugging & Analysis`
- **`terminal_selection`**
  - **Description**: Get the current selection in the active terminal.
  - **Role**: `Information Retrieval & Search`

### Testing

- **`runTests`**
  - **Description**: Run unit tests in files.
  - **Role**: `Execution & Automation`
- **`test_failure`**
  - **Description**: Include test failure information in the prompt.
  - **Role**: `Debugging & Analysis`

### Task Management

- **`manage_todo_list`**
  - **Description**: Manage a structured todo list to track progress and plan tasks.
  - **Role**: `Project & Workspace Management`

## Context7 Library Documentation

- **`mcp_context7_get_library_docs`**
  - **Description**: Fetch up-to-date documentation for a library.
  - **Role**: `Documentation & Metadata`
- **`mcp_context7_resolve_library_id`**
  - **Description**: Resolve a package/product name to a Context7-compatible library ID.
  - **Role**: `Documentation & Metadata`

## MCP GitHub

- **`mcp_github_add_comment_to_pending_review`**
  - **Description**: Add review comment to the requester's latest pending pull request review.
  - **Role**: `Communication & Collaboration`
- **`mcp_github_add_issue_comment`**
  - **Description**: Add a comment to a specific issue in a GitHub repository.
  - **Role**: `Communication & Collaboration`
- **`mcp_github_add_project_item`**
  - **Description**: Add a specific Project item for a user or org.
  - **Role**: `Project & Workspace Management`
- **`mcp_github_add_sub_issue`**
  - **Description**: Add a sub-issue to a parent issue in a GitHub repository.
  - **Role**: `Project & Workspace Management`
- **`mcp_github_assign_copilot_to_issue`**
  - **Description**: Assign Copilot to a specific issue in a GitHub repository.
  - **Role**: `Project & Workspace Management`
- **`mcp_github_bing_search`**
  - **Description**: Performs an AI-powered web search using Bing and Azure AI Agent.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_cancel_workflow_run`**
  - **Description**: Cancel a workflow run.
  - **Role**: `Execution & Automation`
- **`mcp_github_create_and_submit_pull_request_review`**
  - **Description**: Create and submit a review for a pull request without review comments.
  - **Role**: `Version Control & SCM`
- **`mcp_github_create_branch`**
  - **Description**: Create a new branch in a GitHub repository.
  - **Role**: `Version Control & SCM`
- **`mcp_github_create_gist`**
  - **Description**: Create a new gist.
  - **Role**: `File & Code Generation`
- **`mcp_github_create_issue`**
  - **Description**: Create a new issue in a GitHub repository.
  - **Role**: `Project & Workspace Management`
- **`mcp_github_create_or_update_file`**
  - **Description**: Create or update a single file in a GitHub repository.
  - **Role**: `Code Editing & Refactoring`
- **`mcp_github_create_pending_pull_request_review`**
  - **Description**: Create a pending review for a pull request.
  - **Role**: `Version Control & SCM`
- **`mcp_github_create_pull_request`**
  - **Description**: Create a new pull request in a GitHub repository.
  - **Role**: `Version Control & SCM`
- **`mcp_github_create_pull_request_with_copilot`**
  - **Description**: Delegate a task to GitHub Copilot coding agent to perform in the background.
  - **Role**: `Execution & Automation`
- **`mcp_github_create_repository`**
  - **Description**: Create a new GitHub repository in your account or specified organization.
  - **Role**: `Project & Workspace Management`
- **`mcp_github_delete_file`**
  - **Description**: Delete a file from a GitHub repository.
  - **Role**: `Code Editing & Refactoring`
- **`mcp_github_delete_pending_pull_request_review`**
  - **Description**: Delete the requester's latest pending pull request review.
  - **Role**: `Version Control & SCM`
- **`mcp_github_delete_project_item`**
  - **Description**: Delete a specific Project item for a user or org.
  - **Role**: `Project & Workspace Management`
- **`mcp_github_delete_workflow_run_logs`**
  - **Description**: Delete logs for a workflow run.
  - **Role**: `Execution & Automation`
- **`mcp_github_dismiss_notification`**
  - **Description**: Dismiss a notification by marking it as read or done.
  - **Role**: `Communication & Collaboration`
- **`mcp_github_download_workflow_run_artifact`**
  - **Description**: Get download URL for a workflow run artifact.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_fork_repository`**
  - **Description**: Fork a GitHub repository to your account or specified organization.
  - **Role**: `Project & Workspace Management`
- **`mcp_github_get_code_scanning_alert`**
  - **Description**: Get details of a specific code scanning alert in a GitHub repository.
  - **Role**: `Debugging & Analysis`
- **`mcp_github_get_commit`**
  - **Description**: Get details for a commit from a GitHub repository.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_copilot_space`**
  - **Description**: Provide additional context to the chat from a specific Copilot space.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_dependabot_alert`**
  - **Description**: Get details of a specific dependabot alert in a GitHub repository.
  - **Role**: `Debugging & Analysis`
- **`mcp_github_get_discussion`**
  - **Description**: Get a specific discussion by ID.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_discussion_comments`**
  - **Description**: Get comments from a discussion.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_file_contents`**
  - **Description**: Get the contents of a file or directory from a GitHub repository.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_global_security_advisory`**
  - **Description**: Get a global security advisory.
  - **Role**: `Debugging & Analysis`
- **`mcp_github_get_issue`**
  - **Description**: Get details of a specific issue in a GitHub repository.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_issue_comments`**
  - **Description**: Get comments for a specific issue in a GitHub repository.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_job_logs`**
  - **Description**: Download logs for a specific workflow job or efficiently get all failed job logs for a workflow run.
  - **Role**: `Debugging & Analysis`
- **`mcp_github_get_latest_release`**
  - **Description**: Get the latest release in a GitHub repository.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_me`**
  - **Description**: Get details of the authenticated GitHub user.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_notification_details`**
  - **Description**: Get detailed information for a specific GitHub notification.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_project`**
  - **Description**: Get Project for a user or org.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_project_field`**
  - **Description**: Get Project field for a user or org.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_project_item`**
  - **Description**: Get a specific Project item for a user or org.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_pull_request`**
  - **Description**: Get details of a specific pull request in a GitHub repository.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_pull_request_diff`**
  - **Description**: Get the diff of a pull request.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_pull_request_files`**
  - **Description**: Get the files changed in a specific pull request.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_pull_request_review_comments`**
  - **Description**: Get pull request review comments.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_pull_request_reviews`**
  - **Description**: Get reviews for a specific pull request.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_pull_request_status`**
  - **Description**: Get the status of a specific pull request.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_release_by_tag`**
  - **Description**: Get a specific release by its tag name in a GitHub repository.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_secret_scanning_alert`**
  - **Description**: Get details of a specific secret scanning alert in a GitHub repository.
  - **Role**: `Debugging & Analysis`
- **`mcp_github_get_tag`**
  - **Description**: Get details about a specific git tag in a GitHub repository.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_team_members`**
  - **Description**: Get member usernames of a specific team in an organization.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_teams`**
  - **Description**: Get details of the teams the user is a member of.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_workflow_run`**
  - **Description**: Get details of a specific workflow run.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_get_workflow_run_logs`**
  - **Description**: Download logs for a specific workflow run.
  - **Role**: `Debugging & Analysis`
- **`mcp_github_get_workflow_run_usage`**
  - **Description**: Get usage metrics for a workflow run.
  - **Role**: `Debugging & Analysis`
- **`mcp_github_list_branches`**
  - **Description**: List branches in a GitHub repository
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_code_scanning_alerts`**
  - **Description**: List code scanning alerts in a GitHub repository.
  - **Role**: `Debugging & Analysis`
- **`mcp_github_list_commits`**
  - **Description**: Get list of commits of a branch in a GitHub repository.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_copilot_spaces`**
  - **Description**: Retrieves the list of Copilot Spaces accessible to the user, including their names and owners.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_dependabot_alerts`**
  - **Description**: List dependabot alerts in a GitHub repository.
  - **Role**: `Debugging & Analysis`
- **`mcp_github_list_discussion_categories`**
  - **Description**: List discussion categories with their id and name, for a repository or organisation.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_discussions`**
  - **Description**: List discussions for a repository or organisation.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_gists`**
  - **Description**: List gists for a user
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_global_security_advisories`**
  - **Description**: List global security advisories from GitHub.
  - **Role**: `Debugging & Analysis`
- **`mcp_github_list_issue_types`**
  - **Description**: List supported issue types for repository owner (organization).
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_issues`**
  - **Description**: List issues in a GitHub repository.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_notifications`**
  - **Description**: Lists all GitHub notifications for the authenticated user, including unread notifications, mentions, review requests, assignments, and updates on issues or pull requests.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_org_repository_security_advisories`**
  - **Description**: List repository security advisories for a GitHub organization.
  - **Role**: `Debugging & Analysis`
- **`mcp_github_list_project_fields`**
  - **Description**: List Project fields for a user or org
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_project_items`**
  - **Description**: List Project items for a user or org
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_projects`**
  - **Description**: List Projects for a user or org
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_pull_requests`**
  - **Description**: List pull requests in a GitHub repository.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_releases`**
  - **Description**: List releases in a GitHub repository
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_repository_security_advisories`**
  - **Description**: List repository security advisories for a GitHub repository.
  - **Role**: `Debugging & Analysis`
- **`mcp_github_list_secret_scanning_alerts`**
  - **Description**: List secret scanning alerts in a GitHub repository.
  - **Role**: `Debugging & Analysis`
- **`mcp_github_list_starred_repositories`**
  - **Description**: List starred repositories
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_sub_issues`**
  - **Description**: List sub-issues for a specific issue in a GitHub repository.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_tags`**
  - **Description**: List git tags in a GitHub repository
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_workflow_jobs`**
  - **Description**: List jobs for a specific workflow run
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_workflow_run_artifacts`**
  - **Description**: List artifacts for a workflow run
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_workflow_runs`**
  - **Description**: List workflow runs for a specific workflow
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_list_workflows`**
  - **Description**: List workflows in a repository
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_manage_notification_subscription`**
  - **Description**: Manage a notification subscription: ignore, watch, or delete a notification thread subscription.
  - **Role**: `Communication & Collaboration`
- **`mcp_github_manage_repository_notification_subscription`**
  - **Description**: Manage a repository notification subscription: ignore, watch, or delete repository notifications subscription for the provided repository.
  - **Role**: `Communication & Collaboration`
- **`mcp_github_mark_all_notifications_read`**
  - **Description**: Mark all notifications as read
  - **Role**: `Communication & Collaboration`
- **`mcp_github_merge_pull_request`**
  - **Description**: Merge a pull request in a GitHub repository.
  - **Role**: `Version Control & SCM`
- **`mcp_github_push_files`**
  - **Description**: Push multiple files to a GitHub repository in a single commit
  - **Role**: `Version Control & SCM`
- **`mcp_github_remove_sub_issue`**
  - **Description**: Remove a sub-issue from a parent issue in a GitHub repository.
  - **Role**: `Project & Workspace Management`
- **`mcp_github_reprioritize_sub_issue`**
  - **Description**: Reprioritize a sub-issue to a different position in the parent issue's sub-issue list.
  - **Role**: `Project & Workspace Management`
- **`mcp_github_request_copilot_review`**
  - **Description**: Request a GitHub Copilot code review for a pull request.
  - **Role**: `Version Control & SCM`
- **`mcp_github_rerun_failed_jobs`**
  - **Description**: Re-run only the failed jobs in a workflow run
  - **Role**: `Execution & Automation`
- **`mcp_github_rerun_workflow_run`**
  - **Description**: Re-run an entire workflow run
  - **Role**: `Execution & Automation`
- **`mcp_github_run_workflow`**
  - **Description**: Run an Actions workflow by workflow ID or filename
  - **Role**: `Execution & Automation`
- **`mcp_github_search_code`**
  - **Description**: Fast and precise code search across ALL GitHub repositories using GitHub's native search engine.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_search_issues`**
  - **Description**: Search for issues in GitHub repositories using issues search syntax already scoped to is:issue
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_search_orgs`**
  - **Description**: Find GitHub organizations by name, location, or other organization metadata.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_search_pull_requests`**
  - **Description**: Search for pull requests in GitHub repositories using issues search syntax already scoped to is:pr
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_search_repositories`**
  - **Description**: Find GitHub repositories by name, description, readme, topics, or other metadata.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_search_users`**
  - **Description**: Find GitHub users by username, real name, or other profile information.
  - **Role**: `Information Retrieval & Search`
- **`mcp_github_star_repository`**
  - **Description**: Star a GitHub repository
  - **Role**: `Communication & Collaboration`
- **`mcp_github_submit_pending_pull_request_review`**
  - **Description**: Submit the requester's latest pending pull request review, normally this is a final step after creating a pending review, adding comments first, unless you know that the user already did the first two steps, you should check before calling this.
  - **Role**: `Version Control & SCM`
- **`mcp_github_unstar_repository`**
  - **Description**: Unstar a GitHub repository
  - **Role**: `Communication & Collaboration`
- **`mcp_github_update_gist`**
  - **Description**: Update an existing gist
  - **Role**: `Code Editing & Refactoring`
- **`mcp_github_update_issue`**
  - **Description**: Update an existing issue in a GitHub repository.
  - **Role**: `Project & Workspace Management`
- **`mcp_github_update_pull_request`**
  - **Description**: Update an existing pull request in a GitHub repository.
  - **Role**: `Version Control & SCM`
- **`mcp_github_update_pull_request_branch`**
  - **Description**: Update the branch of a pull request with the latest changes from the base branch.
  - **Role**: `Version Control & SCM`

## Awesome Copilot

- **`mcp_awesome_copil_list_collections`**
  - **Description**: Lists all collections available in the repository metadata.
  - **Role**: `Information Retrieval & Search`
- **`mcp_awesome_copil_load_collection`**
  - **Description**: Loads a collection by id from the metadata.
  - **Role**: `Information Retrieval & Search`
- **`mcp_awesome_copil_load_instruction`**
  - **Description**: Loads a custom instruction from the repository.
  - **Role**: `Information Retrieval & Search`
- **`mcp_awesome_copil_search_instructions`**
  - **Description**: Searches custom instructions based on keywords.
  - **Role**: `Information Retrieval & Search`

## Nx

- **`mcp_nx_mcp_server_nx_available_plugins`**
  - **Description**: Returns a list of available Nx plugins.
  - **Role**: `Information Retrieval & Search`
- **`mcp_nx_mcp_server_nx_cloud_cipe_details`**
  - **Description**: Returns CI pipeline execution details from Nx Cloud.
  - **Role**: `Debugging & Analysis`
- **`mcp_nx_mcp_server_nx_cloud_fix_cipe_failure`**
  - **Description**: Returns details about a failed CI pipeline execution.
  - **Role**: `Debugging & Analysis`
- **`mcp_nx_mcp_server_nx_cloud_pipeline_executions_details`**
  - **Description**: Get detailed information about a specific pipeline execution.
  - **Role**: `Debugging & Analysis`
- **`mcp_nx_mcp_server_nx_cloud_pipeline_executions_search`**
  - **Description**: Search for pipeline executions in Nx Cloud.
  - **Role**: `Information Retrieval & Search`
- **`mcp_nx_mcp_server_nx_cloud_runs_details`**
  - **Description**: Get detailed information about a specific run in Nx Cloud.
  - **Role**: `Debugging & Analysis`
- **`mcp_nx_mcp_server_nx_cloud_runs_search`**
  - **Description**: Search for runs in Nx Cloud.
  - **Role**: `Information Retrieval & Search`
- **`mcp_nx_mcp_server_nx_cloud_tasks_details`**
  - **Description**: Search for detailed task execution information in Nx Cloud.
  - **Role**: `Debugging & Analysis`
- **`mcp_nx_mcp_server_nx_cloud_tasks_search`**
  - **Description**: Search for task statistics in Nx Cloud.
  - **Role**: `Information Retrieval & Search`
- **`mcp_nx_mcp_server_nx_docs`**
  - **Description**: Returns relevant Nx documentation sections for a query.
  - **Role**: `Documentation & Metadata`
- **`mcp_nx_mcp_server_nx_generator_schema`**
  - **Description**: Returns the JSON schema for an Nx generator.
  - **Role**: `Information Retrieval & Search`
- **`mcp_nx_mcp_server_nx_generators`**
  - **Description**: Returns a list of relevant generators for a query.
  - **Role**: `Information Retrieval & Search`
- **`mcp_nx_mcp_server_nx_project_details`**
  - **Description**: Returns the complete project configuration for a specific Nx project.
  - **Role**: `Information Retrieval & Search`
- **`mcp_nx_mcp_server_nx_run_generator`**
  - **Description**: Opens the generate UI with pre-filled options.
  - **Role**: `Execution & Automation`
- **`mcp_nx_mcp_server_nx_visualize_graph`**
  - **Description**: Visualize the Nx project or task graph.
  - **Role**: `Debugging & Analysis`
- **`mcp_nx_mcp_server_nx_workspace`**
  - **Description**: Returns a representation of the Nx project graph and configuration.
  - **Role**: `Information Retrieval & Search`
- **`mcp_nx_mcp_server_nx_workspace_path`**
  - **Description**: Returns the path to the Nx workspace root.
  - **Role**: `Information Retrieval & Search`

## GitKraken

- **`mcp_gitkraken_git_add_or_commit`**
  - **Description**: Add file contents to the index or record changes to the repository.
  - **Role**: `Version Control & SCM`
- **`mcp_gitkraken_git_blame`**
  - **Description**: Show what revision and author last modified each line of a file.
  - **Role**: `Debugging & Analysis`
- **`mcp_gitkraken_git_branch`**
  - **Description**: List or create branches.
  - **Role**: `Version Control & SCM`
- **`mcp_gitkraken_git_checkout`**
  - **Description**: Switch branches or restore working tree files.
  - **Role**: `Version Control & SCM`
- **`mcp_gitkraken_git_log_or_diff`**
  - **Description**: Show commit logs or changes between commits.
  - **Role**: `Information Retrieval & Search`
- **`mcp_gitkraken_git_push`**
  - **Description**: Update remote refs along with associated objects.
  - **Role**: `Version Control & SCM`
- **`mcp_gitkraken_git_stash`**
  - **Description**: Stash the changes in a dirty working directory.
  - **Role**: `Version Control & SCM`
- **`mcp_gitkraken_git_status`**
  - **Description**: Show the working tree status.
  - **Role**: `Information Retrieval & Search`
- **`mcp_gitkraken_git_worktree`**
  - **Description**: List or add git worktrees.
  - **Role**: `Version Control & SCM`
- **`mcp_gitkraken_gitkraken_workspace_list`**
  - **Description**: Lists all GitKraken workspaces.
  - **Role**: `Information Retrieval & Search`
- **`mcp_gitkraken_issues_add_comment`**
  - **Description**: Add a comment to an issue.
  - **Role**: `Communication & Collaboration`
- **`mcp_gitkraken_issues_assigned_to_me`**
  - **Description**: Fetch issues assigned to the user.
  - **Role**: `Information Retrieval & Search`
- **`mcp_gitkraken_issues_get_detail`**
  - **Description**: Retrieve detailed information about a specific issue.
  - **Role**: `Information Retrieval & Search`
- **`mcp_gitkraken_pull_request_assigned_to_me`**
  - **Description**: Search pull requests where you are the assignee, author, or reviewer.
  - **Role**: `Information Retrieval & Search`
- **`mcp_gitkraken_pull_request_create`**
  - **Description**: Create a new pull request.
  - **Role**: `Version Control & SCM`
- **`mcp_gitkraken_pull_request_create_review`**
  - **Description**: Create a review for a pull request.
  - **Role**: `Version Control & SCM`
- **`mcp_gitkraken_pull_request_get_comments`**
  - **Description**: Get all the comments in a pull request.
  - **Role**: `Information Retrieval & Search`
- **`mcp_gitkraken_pull_request_get_detail`**
  - **Description**: Get a specific pull request.
  - **Role**: `Information Retrieval & Search`
- **`mcp_gitkraken_repository_get_file_content`**
  - **Description**: Get file content from a repository.
  - **Role**: `Information Retrieval & Search`

## Console Ninja (Runtime Debugging)

- **`console_ninja_runtimeErrors`**
  - **Description**: Get application runtime errors.
  - **Role**: `Debugging & Analysis`
- **`console_ninja_runtimeLogs`**
  - **Description**: Get application runtime logs.
  - **Role**: `Debugging & Analysis`
- **`console_ninja_runtimeLogsAndErrors`**
  - **Description**: Get application runtime logs and errors.
  - **Role**: `Debugging & Analysis`
- **`console_ninja_runtimeLogsByLocation`**
  - **Description**: Get application runtime logs for a given file and line.
  - **Role**: `Debugging & Analysis`

## Prisma (Database)

- **`prisma_migrate_dev`**
  - **Description**: Update Prisma schema and apply migrations.
  - **Role**: `Execution & Automation`
- **`prisma_migrate_reset`**
  - **Description**: Reset the database and migration history.
  - **Role**: `Execution & Automation`
- **`prisma_migrate_status`**
  - **Description**: Check the status of migrations.
  - **Role**: `Information Retrieval & Search`
- **`prisma_platform_login`**
  - **Description**: Login or create a Prisma Platform account.
  - **Role**: `Tool & Environment Management`
- **`prisma_postgres_create_database`**
  - **Description**: Create a new online Prisma Postgres database.
  - **Role**: `Project & Workspace Management`
- **`prisma_studio`**
  - **Description**: Open Prisma Studio to view and edit data.
  - **Role**: `Debugging & Analysis`

## Tool Activation

This category contains toolsets created by VS Code to manage a large number of available tools. Activating a toolset makes a specific group of related tools available to the AI model, helping to manage context and tool discoverability.

- **`activate_collection_management_tools`**
  - **Description**: Activate tools for managing collections and custom instructions.
  - **Role**: `Tool & Environment Management`
- **`activate_console_ninja_logging_tools`**
  - **Description**: Activate tools for monitoring and debugging applications by capturing runtime errors and logs.
  - **Role**: `Tool & Environment Management`
- **`activate_git_management_tools`**
  - **Description**: Activate tools for managing Git repositories.
  - **Role**: `Tool & Environment Management`
- **`activate_git_tools_file_management`**
  - **Description**: Activate tools for file management within a Git repository.
  - **Role**: `Tool & Environment Management`
- **`activate_git_tools_issue_management`**
  - **Description**: Activate tools for managing issues and pull requests within a Git repository.
  - **Role**: `Tool & Environment Management`
- **`activate_git_tools_version_control`**
  - **Description**: Activate tools that facilitate version control operations using Git.
  - **Role**: `Tool & Environment Management`
- **`activate_git_tools_workspace_management`**
  - **Description**: Activate tools that assist in managing GitKraken workspaces.
  - **Role**: `Tool & Environment Management`
- **`activate_github_commit_management`**
  - **Description**: Activate tools for managing commits and repository stars.
  - **Role**: `Tool & Environment Management`
- **`activate_github_copilot_management`**
  - **Description**: Activate tools for managing GitHub Copilot interactions.
  - **Role**: `Tool & Environment Management`
- **`activate_github_discussion_management`**
  - **Description**: Activate tools for managing discussions within GitHub repositories.
  - **Role**: `Tool & Environment Management`
- **`activate_github_gist_management`**
  - **Description**: Activate tools for managing GitHub gists.
  - **Role**: `Tool & Environment Management`
- **`activate_github_issue_management`**
  - **Description**: Activate tools for managing issues within GitHub repositories.
  - **Role**: `Tool & Environment Management`
- **`activate_github_notification_management`**
  - **Description**: Activate tools for managing notifications within GitHub.
  - **Role**: `Tool & Environment Management`
- **`activate_github_project_management`**
  - **Description**: Activate tools for managing projects within GitHub.
  - **Role**: `Tool & Environment Management`
- **`activate_github_pull_request_management`**
  - **Description**: Activate tools for managing pull requests in GitHub.
  - **Role**: `Tool & Environment Management`
- **`activate_github_pull_request_tools`**
  - **Description**: Activate tools to manage and interact with GitHub pull requests.
  - **Role**: `Tool & Environment Management`
- **`activate_github_repository_management`**
  - **Description**: Activate tools for managing GitHub repositories.
  - **Role**: `Tool & Environment Management`
- **`activate_github_search_tools`**
  - **Description**: Activate tools for searching various elements within GitHub.
  - **Role**: `Tool & Environment Management`
- **`activate_github_security_management`**
  - **Description**: Activate tools for managing security alerts and advisories.
  - **Role**: `Tool & Environment Management`
- **`activate_github_team_management`**
  - **Description**: Activate tools for managing teams within GitHub organizations.
  - **Role**: `Tool & Environment Management`
- **`activate_github_workflow_management`**
  - **Description**: Activate tools for managing GitHub Actions workflows.
  - **Role**: `Tool & Environment Management`
- **`activate_gitkraken_issue_tools`**
  - **Description**: Activate tools to enhance issue tracking and management within GitKraken.
  - **Role**: `Tool & Environment Management`
- **`activate_gitkraken_pull_request_tools`**
  - **Description**: Activate tools for managing pull requests within GitKraken.
  - **Role**: `Tool & Environment Management`
- **`activate_gitkraken_repository_tools`**
  - **Description**: Activate tools for managing repositories and workspaces within GitKraken.
  - **Role**: `Tool & Environment Management`
- **`activate_mcp_console_ninja_runtime_tools`**
  - **Description**: Activate tools for monitoring and debugging applications with runtime insights.
  - **Role**: `Tool & Environment Management`
- **`activate_nx_cloud_pipeline_tools`**
  - **Description**: Activate tools to manage and analyze CI/CD pipeline executions within Nx Cloud.
  - **Role**: `Tool & Environment Management`
- **`activate_nx_generator_tools`**
  - **Description**: Activate a tool to open the generate UI for running Nx generators.
  - **Role**: `Tool & Environment Management`
- **`activate_nx_plugin_management_tools`**
  - **Description**: Activate tools for managing and utilizing Nx plugins and generators.
  - **Role**: `Tool & Environment Management`
- **`activate_nx_project_configuration_tools`**
  - **Description**: Activate tools for providing detailed information about Nx projects.
  - **Role**: `Tool & Environment Management`
- **`activate_nx_task_management_tools`**
  - **Description**: Activate tools for managing and analyzing task executions within Nx Cloud.
  - **Role**: `Tool & Environment Management`
- **`activate_prisma_tools`**
  - **Description**: Activate tools for managing database migrations and viewing data.
  - **Role**: `Tool & Environment Management`

## Understanding and Using Copilot Toolsets

The extensive list of tools available within VS Code is managed through a system called "Toolsets." This system is designed to ensure performance and manage the contextual information provided to the AI model by only making a relevant subset of tools available at any given time.

### What are Toolsets?

A toolset is a pre-defined, logical grouping of related tools. Instead of overwhelming the AI with hundreds of tools at once, VS Code can activate a specific toolset based on the task at hand. For example, if the task involves managing a GitHub pull request, the `github_pull_request_management` toolset can be activated, which makes tools like `get_pull_request`, `create_pull_request_review`, and `merge_pull_request` available.

The **Tool Activation** category lists the commands that can be used to load these built-in toolsets. Each `activate_*` tool corresponds to a specific group of functionalities.

### How Toolset Activation Works

The process is dynamic and works in two primary ways:

1. **Programmatic Activation by AI**: The AI model, based on the user's request, determines the most appropriate set of capabilities needed. It then calls the relevant `activate_*` tool from the "Tool Activation" category. This is a dynamic, in-the-moment action taken by the AI to load a built-in toolset.

2. **User-Defined Custom Toolsets**: Users can create their own persistent, custom toolsets using a `toolset-name.toolsets.jsonc` file. This allows for fine-grained control over which tools are grouped together for specific workflows.

For an AI model, the workflow for programmatic activation is as follows:

1. **Analyze the User's Goal**: Understand the core task (e.g., "refactor a file," "debug a CI pipeline," "review a PR").
2. **Consult This Document**: Scan this `mcp-tools.md` file to identify which tools and categories are relevant to the goal. The `Role` metadata for each tool is critical for this step.
3. **Identify the Correct Toolset**: Find the `activate_*` tool in the "Tool Activation" section that corresponds to the required tools.
4. **Execute Activation**: Call the `activate_*` tool to make the desired tools available for subsequent steps.

### Creating Custom Toolsets with `toolsets.jsonc`

In addition to the built-in, programmatically activated toolsets, you can define your own custom toolsets in a `toolset-name.toolsets.jsonc` file. This file allows you to create named groups of tools tailored to your specific projects or tasks.

#### File Format and Content

The file uses JSON with Comments (JSONC) format. Inside, you define an object where each key represents the name of your custom toolset.

**Example `my-toolsets.toolsets.jsonc`:**

```jsonc
// Place your tool sets here...
{
    "frontend-debugging": {
        "tools": [
            "get_errors",
            "console_ninja_runtimeLogsAndErrors",
            "read_file",
            "list_dir"
        ],
        "description": "A set of tools for debugging frontend applications.",
        "icon": "bug"
    },
    "pr-review": {
        "tools": [
            "mcp_github_get_pull_request",
            "mcp_github_get_pull_request_files",
            "mcp_github_add_comment_to_pending_review",
            "mcp_github_submit_pending_pull_request_review"
        ],
        "description": "Tools for conducting a GitHub pull request review.",
        "icon": "git-pull-request"
    }
}
```

#### Structure Breakdown

- **`"toolSetName"`**: The top-level keys (`"frontend-debugging"`, `"pr-review"`) are the names of your custom toolsets.
- **`tools`**: An array of strings. Each string must be the exact name of a tool as listed in this documentation (e.g., `create_file`, `mcp_github_get_issue`). This is the most critical part of the configuration.
- **`description`**: A brief, human-readable description of what the toolset is for.
- **`icon`**: The name of a [VS Code icon](https://code.visualstudio.com/api/references/icons-in-labels#icon-listing) to associate with the toolset in the UI.

### Using This Document to Build Toolset Configurations

This document is the primary source of truth for an AI model to understand the available tools and make informed decisions about which toolset to activate. It is also the definitive reference for developers creating `toolsets.jsonc` files.

**For AI Models**: The conceptual plan for activating a toolset remains the same, but the AI can also be aware of potentially available custom toolsets if their context is provided.

**For Developers**: When creating a `toolsets.jsonc` file, refer to the tool names listed in this document. The `Role` metadata can help you cluster tools logically for different problem-solving scenarios. For example, to build a toolset for database work, you could group tools with the `Execution & Automation` and `Debugging & Analysis` roles from the "Prisma (Database)" category.

#### Conceptual Configuration Example (AI Planning)

An AI could generate the following internal plan when asked to "Review a PR and leave comments":

```yaml
# Conceptual Toolset Configuration for "Reviewing a GitHub PR"
# Generated by an AI model based on mcp-tools.md

task: "Review a GitHub pull request and leave comments on specific lines."

required_roles:
  - "Version Control & SCM"
  - "Information Retrieval & Search"
  - "Communication & Collaboration"

analysis:
  - The task requires getting PR data, reading files, and adding comments.
  - The "MCP GitHub" category contains tools like `get_pull_request`, `get_pull_request_files`, and `add_comment_to_pending_review`.
  - A user-defined toolset named "pr-review" might exist and be suitable.
  - If not, the built-in "Tool Activation" category has a corresponding tool: `activate_github_pull_request_management`.

activation_plan:
  - tool_to_activate: "activate_github_pull_request_management" # or use a known custom toolset
  - reason: "This toolset provides the necessary functions for fetching PR details, files, and submitting reviews."

subsequent_steps:
  - call: `mcp_github_get_pull_request`
  - call: `mcp_github_get_pull_request_files`
  - call: `mcp_github_create_pending_pull_request_review`
  - call: `mcp_github_add_comment_to_pending_review`
  - call: `mcp_github_submit_pending_pull_request_review`
```

By providing this structured documentation, including categories, descriptions, and problem-solving roles, this file empowers both AI models and developers to navigate the complex tool ecosystem efficiently, leading to more accurate and effective task completion.
