## QDMS Document Binding

The **QDMS (Quality Document Management System)** integration allows you to link documents from a remote QDMS server to specific pages in the application. The linked document is then displayed directly on the selected page.

Each page can have multiple QDMS records configured, but **only one record can be active at a time**. This ensures that the page always shows a single, clearly defined document.

### Usage Notes

* Before a QDMS record can be activated, the document **must be fetched** from the remote server using the **Fetch** button.
* If a page already has an active QDMS record, another record for the same page cannot be activated at the same time.
* To change the document shown on a page, first add a new record, then fetch and activate the new one.
