# Revision Management

The Revision Management (Timeline) feature helps users track and manage changes in the web modeling tool. It automatically records modifications, creating a history of updates that users can review, navigate, and restore if needed. When a file is saved, or when a manual saving action is triggered, a timeline entry is added to the history. This allows the user to see how the model evolves over time, to keep track of and compare different versions, and revert to previous states when necessary. This provides a safety net for experimentation without the risk of losing important work.

[insert demo gif here]

## System Overview



## Features

### Timeline Core Features

- **Add timline entry automatically on save** 
    - Precondition: Diagram open
    - User action: Save file (CTRL+S or via VSCode auto-save)
    - Result: New timeline entry added ("File Saved") in Timeline window
- **Add timeline entry manually**
    - Precondition: Diagram & Timeline open
    - User action: In Timeline, click on "Create new entry"
    - Result: New timeline entry added ("File Saved") in Timeline window
- **View timeline (history)**
    - Precondition: Diagram open, Timeline is not empty
    - User action: Open Timeline
    - Result: List of previously added timeline entries (history) in Timeline window
- **View timeline entry (model state)**
    - Precondition: Diagram & Timeline open, Timeline is not empty
    - User action: Click on a timeline entry
    - Result: Diagram for the selected timeline entry is displayed ("Minimap")
- **Rename timeline entry**
    - Precondition: Diagram & Timeline open, Timeline is not empty
    - User action: In Timeline, click on the edit icon (pencil) of an entry, edit the name, click on the save icon
    - Result: Selected timeline entry is renamed
- **Delete timeline entry**
    - Precondition: Diagram & Timeline open, Timeline is not empty
    - User action: In Timeline, click on the delete icon (trash can) of an entry, confirm the deletion in the dialog
    - Result: Selected timeline entry is deleted
- **Restore timeline**
    - Precondition: Diagram & Timeline open, Timeline is not empty
    - User action: In Timeline, click on the entry to be restored, click restore
    - Result: Selected timeline entry is restored (**Attention**: The diagram must be re-opened to see the update - see chapter "Limitations" below!), history is cropped (all entries newer than the restored entry are deleted)

### Integration

- **Persistence**
    - Precondition: Diagram & Timeline open, Timeline is not empty
    - User action: Close VSCode and re-open
    - Result: The timeline is automatically persisted on the user's device (localStorage), and still contains the previously added entries
- **Per-diagram timeline**
    - Precondition: Two diagrams open, both with non-empty timelines
    - User action: Switch between diagrams
    - Result: Timeline changes per diagram

### Import/Export

- **Export timeline (history)**
    - Precondition: Diagram & Timeline open, Timeline is not empty
    - User action: Click "export" (top-right of timeline, cloud with downwards arrow), in dialog select "entire timeline" or "last n entries", click export, choose file location
    - Result: Timeline exported as JSON to selected location
- **Import timeline (history)**
    - Precondition: Diagram & Timeline open, Timeline is empty
    - User action: Click "import" (top-right of timeline, cloud with upwards arrow), in dialog select an import JSON file (e.g., previous export), select "entire timeline" or "last n entries", click import
    - Result: Timeline imported (contains imported entries)
- **Export single model state (SVG)**
    - Precondition: Diagram & Timeline open, Timeline is not empty
    - User action: Click on a timeline entry, click on "Export Snapshot", choose a file location
    - Result: SVG export of the selected timeline entry is saved to the selected location

## Implementation


# Course Documentation

## Workflow

### Development Process

### Encountered Problems

## Limitations / Implementation Gaps

## Future Work

## Feedback

### BigUML Feedback

### Course Feedback




