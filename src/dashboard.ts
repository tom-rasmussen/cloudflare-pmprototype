export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PM Feedback Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f7fa;
            min-height: 100vh;
        }
        .container { max-width: 1600px; margin: 0 auto; padding: 20px; }

        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 15px;
        }
        h1 { color: #1a202c; font-size: 24px; }
        .header-actions { display: flex; gap: 10px; flex-wrap: wrap; }

        /* Buttons */
        .btn {
            padding: 10px 16px;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-primary { background: #f6821f; color: white; }
        .btn-primary:hover { background: #e57310; }
        .btn-secondary { background: #4299e1; color: white; }
        .btn-secondary:hover { background: #3182ce; }
        .btn-success { background: #48bb78; color: white; }
        .btn-success:hover { background: #38a169; }
        .btn-danger { background: #f56565; color: white; }
        .btn-danger:hover { background: #e53e3e; }
        .btn-outline { background: white; border: 2px solid #e2e8f0; color: #4a5568; }
        .btn-outline:hover { border-color: #cbd5e0; background: #f7fafc; }
        .btn-sm { padding: 6px 12px; font-size: 12px; }

        /* Tabs */
        .tabs {
            display: flex;
            gap: 5px;
            background: white;
            padding: 5px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .tab {
            padding: 10px 20px;
            border: none;
            background: transparent;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            color: #718096;
        }
        .tab.active { background: #f6821f; color: white; }
        .tab:hover:not(.active) { background: #f7fafc; }

        /* Cards */
        .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            padding: 20px;
            margin-bottom: 20px;
        }
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .card-title { font-size: 16px; font-weight: 600; color: #2d3748; }

        /* Products Grid */
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .product-card {
            background: white;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.2s;
        }
        .product-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .product-card.selected { border-color: #f6821f; }
        .product-name { font-weight: 600; margin-bottom: 5px; }
        .product-desc { font-size: 12px; color: #718096; margin-bottom: 10px; }
        .product-stats { display: flex; gap: 15px; }
        .stat { text-align: center; }
        .stat-value { font-size: 20px; font-weight: 700; }
        .stat-label { font-size: 10px; color: #a0aec0; text-transform: uppercase; }

        /* Filters */
        .filters {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
            margin-bottom: 15px;
        }
        .filter-group { display: flex; align-items: center; gap: 8px; }
        .filter-label { font-size: 12px; color: #718096; }
        .filter-select {
            padding: 8px 12px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            font-size: 13px;
            background: white;
        }
        .search-input {
            flex: 1;
            min-width: 200px;
            padding: 8px 12px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            font-size: 13px;
        }
        .search-input:focus { outline: none; border-color: #f6821f; }

        /* Kanban Board */
        .kanban-board {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            min-height: 400px;
        }
        .kanban-column {
            background: #f7fafc;
            border-radius: 8px;
            padding: 15px;
        }
        .kanban-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
        }
        .kanban-title { font-weight: 600; color: #2d3748; }
        .kanban-count {
            background: #e2e8f0;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;
        }
        .kanban-cards { display: flex; flex-direction: column; gap: 10px; }

        /* Feedback Cards */
        .feedback-card {
            background: white;
            border-radius: 6px;
            padding: 12px;
            border-left: 4px solid #cbd5e0;
            cursor: pointer;
            transition: all 0.15s;
        }
        .feedback-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .feedback-card.positive { border-left-color: #48bb78; }
        .feedback-card.negative { border-left-color: #f56565; }
        .feedback-card.neutral { border-left-color: #ed8936; }
        .feedback-title { font-size: 13px; font-weight: 600; margin-bottom: 5px; color: #2d3748; }
        .feedback-preview { font-size: 12px; color: #718096; margin-bottom: 8px; line-height: 1.4; }
        .feedback-meta { font-size: 11px; color: #a0aec0; display: flex; gap: 10px; flex-wrap: wrap; }
        .feedback-badges { display: flex; gap: 4px; margin-top: 8px; flex-wrap: wrap; }
        .badge {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: 600;
        }
        .badge-positive { background: #c6f6d5; color: #22543d; }
        .badge-negative { background: #fed7d7; color: #742a2a; }
        .badge-neutral { background: #feebc8; color: #7c2d12; }
        .badge-category { background: #e9d8fd; color: #553c9a; }
        .badge-source { background: #bee3f8; color: #2c5282; }
        .badge-priority-low { background: #e2e8f0; color: #4a5568; }
        .badge-priority-medium { background: #feebc8; color: #7c2d12; }
        .badge-priority-high { background: #fed7d7; color: #742a2a; }
        .badge-priority-critical { background: #742a2a; color: white; }
        .badge-internal { background: #faf5ff; color: #6b21a8; border: 1px solid #d8b4fe; }
        .badge-external { background: #f0fdf4; color: #166534; border: 1px solid #86efac; }

        /* List View */
        .feedback-list { display: flex; flex-direction: column; gap: 10px; }
        .feedback-item {
            background: white;
            border-radius: 6px;
            padding: 15px;
            border-left: 4px solid #cbd5e0;
            cursor: pointer;
            transition: background 0.15s;
        }
        .feedback-item:hover { background: #f7fafc; }
        .feedback-item.positive { border-left-color: #48bb78; }
        .feedback-item.negative { border-left-color: #f56565; }
        .feedback-item-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px; }

        /* Modal */
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        .modal-overlay.active { display: flex; }
        .modal {
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 85vh;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-title { font-size: 18px; font-weight: 600; }
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #a0aec0;
        }
        .modal-body { padding: 20px; overflow-y: auto; max-height: 60vh; }
        .modal-footer { padding: 15px 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 10px; }

        /* Form */
        .form-group { margin-bottom: 15px; }
        .form-label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 5px; color: #4a5568; }
        .form-input, .form-textarea, .form-select {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            font-size: 14px;
        }
        .form-input:focus, .form-textarea:focus, .form-select:focus {
            outline: none;
            border-color: #4299e1;
        }
        .form-textarea { min-height: 100px; resize: vertical; }

        /* Status buttons */
        .status-buttons { display: flex; gap: 5px; margin-top: 10px; }
        .status-btn {
            padding: 4px 10px;
            border: none;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            background: #e2e8f0;
            color: #4a5568;
        }
        .status-btn:hover { background: #cbd5e0; }
        .status-btn.active { background: #4299e1; color: white; }

        /* Loading & Empty */
        .loading, .empty-state {
            text-align: center;
            padding: 40px;
            color: #718096;
        }
        .empty-state-icon { font-size: 48px; margin-bottom: 10px; }

        /* View Toggle */
        .view-toggle { display: flex; gap: 5px; }
        .view-btn {
            padding: 8px 12px;
            border: 2px solid #e2e8f0;
            background: white;
            border-radius: 6px;
            cursor: pointer;
        }
        .view-btn.active { background: #4299e1; border-color: #4299e1; color: white; }

        /* Toast */
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #2d3748;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 2000;
            display: none;
        }
        .toast.show { display: block; }
        .toast.success { background: #48bb78; }
        .toast.error { background: #f56565; }

        /* AI Summary Panel */
        .main-layout {
            display: grid;
            grid-template-columns: 1fr 320px;
            gap: 20px;
        }
        .main-layout.no-summary {
            grid-template-columns: 1fr;
        }
        .ai-summary-panel {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 20px;
            height: fit-content;
            position: sticky;
            top: 20px;
        }
        .ai-summary-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 15px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e2e8f0;
        }
        .ai-summary-header h3 {
            font-size: 14px;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
        }
        .ai-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 10px;
            padding: 2px 8px;
            border-radius: 10px;
            font-weight: 600;
        }
        .summary-section {
            margin-bottom: 18px;
        }
        .summary-section-title {
            font-size: 11px;
            font-weight: 600;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }
        .summary-text {
            font-size: 13px;
            line-height: 1.6;
            color: #4a5568;
        }
        .summary-themes {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        .theme-tag {
            background: #edf2f7;
            color: #4a5568;
            font-size: 11px;
            padding: 4px 10px;
            border-radius: 12px;
            font-weight: 500;
        }
        .summary-stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .summary-stat-row:last-child { border-bottom: none; }
        .summary-stat-label { font-size: 12px; color: #718096; }
        .summary-stat-value { font-size: 13px; font-weight: 600; }
        .summary-stat-value.positive { color: #48bb78; }
        .summary-stat-value.negative { color: #f56565; }
        .summary-stat-value.neutral { color: #ed8936; }
        .critical-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: #fff5f5;
            border-radius: 6px;
            margin-bottom: 6px;
            cursor: pointer;
            transition: background 0.15s;
        }
        .critical-item:hover { background: #fed7d7; }
        .critical-item .priority-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
        }
        .critical-item .priority-dot.critical { background: #c53030; }
        .critical-item .priority-dot.high { background: #dd6b20; }
        .critical-item-title {
            font-size: 12px;
            color: #2d3748;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .recent-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: #f7fafc;
            border-radius: 6px;
            margin-bottom: 6px;
            cursor: pointer;
            transition: background 0.15s;
        }
        .recent-item:hover { background: #edf2f7; }
        .recent-item-title {
            font-size: 12px;
            color: #2d3748;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .recent-item-date {
            font-size: 10px;
            color: #a0aec0;
        }
        .summary-loading {
            text-align: center;
            padding: 40px 20px;
            color: #718096;
        }
        .summary-loading-spinner {
            width: 24px;
            height: 24px;
            border: 3px solid #e2e8f0;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }

    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>📊 PM Feedback Dashboard</h1>
            <div class="header-actions">
                <button class="btn btn-primary" onclick="openProductModal()">+ New Product</button>
                <button class="btn btn-success" onclick="openTicketModal()">+ New Ticket</button>
                <button class="btn btn-secondary" onclick="loadMockData()">Load Demo Data</button>
                <button class="btn btn-outline" onclick="loadProducts()">↻ Refresh</button>
            </div>
        </div>


        <!-- Products -->
        <div id="products" class="products-grid"></div>

        <!-- Main Content (shown after selecting product) -->
        <div id="main-content" style="display: none;">
            <!-- Tabs -->
            <div class="tabs">
                <button class="tab active" onclick="switchTab('kanban')">📋 Kanban</button>
                <button class="tab" onclick="switchTab('list')">📝 List View</button>
            </div>

            <!-- Filters -->
            <div class="card">
                <div class="filters">
                    <input type="text" class="search-input" id="search-input" placeholder="Search feedback..." onkeyup="handleSearch(event)">
                    <button class="btn btn-secondary btn-sm" onclick="semanticSearch()">🔍 AI Search</button>

                    <div class="filter-group">
                        <span class="filter-label">Source:</span>
                        <select class="filter-select" id="filter-source" onchange="applyFilters()">
                            <option value="">All</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <span class="filter-label">Sentiment:</span>
                        <select class="filter-select" id="filter-sentiment" onchange="applyFilters()">
                            <option value="">All</option>
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                            <option value="neutral">Neutral</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <span class="filter-label">Category:</span>
                        <select class="filter-select" id="filter-category" onchange="applyFilters()">
                            <option value="">All</option>
                            <option value="bug">Bug</option>
                            <option value="feature_request">Feature</option>
                            <option value="ux_issue">UX</option>
                            <option value="performance">Performance</option>
                            <option value="praise">Praise</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <span class="filter-label">Priority:</span>
                        <select class="filter-select" id="filter-priority" onchange="applyFilters()">
                            <option value="">All</option>
                            <option value="critical">🔴 Critical</option>
                            <option value="high">🟠 High</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="low">🟢 Low</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <span class="filter-label">Type:</span>
                        <select class="filter-select" id="filter-type" onchange="applyFilters()">
                            <option value="">All</option>
                            <option value="external">👥 External (Customers)</option>
                            <option value="internal">🏢 Internal (Team)</option>
                        </select>
                    </div>

                    <button class="btn btn-outline btn-sm" onclick="clearFilters()">Clear</button>
                </div>
            </div>

            <!-- Main Layout with AI Panel -->
            <div class="main-layout" id="main-layout">
                <div class="content-area">
                    <!-- Tab Content -->
                    <div id="tab-kanban" class="tab-content">
                        <div class="kanban-board" id="kanban-board"></div>
                    </div>

                    <div id="tab-list" class="tab-content" style="display: none;">
                        <div class="card">
                            <div class="feedback-list" id="feedback-list"></div>
                        </div>
                    </div>
                </div>

                <!-- AI Summary Panel -->
                <div class="ai-summary-panel" id="ai-summary-panel">
                    <div class="ai-summary-header">
                        <span>🤖</span>
                        <h3>AI Insights</h3>
                        <span class="ai-badge">Auto</span>
                    </div>
                    <div id="ai-summary-content">
                        <div class="summary-loading">
                            <div class="summary-loading-spinner"></div>
                            <div>Analyzing feedback...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Product Modal -->
    <div class="modal-overlay" id="product-modal">
        <div class="modal">
            <div class="modal-header">
                <span class="modal-title" id="product-modal-title">New Product</span>
                <button class="modal-close" onclick="closeModal('product-modal')">&times;</button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="product-id">
                <div class="form-group">
                    <label class="form-label">Product Name *</label>
                    <input type="text" class="form-input" id="product-name" placeholder="e.g., CloudSync Pro">
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" id="product-description" placeholder="Brief description..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <input type="text" class="form-input" id="product-category" placeholder="e.g., SaaS, Mobile, etc.">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="closeModal('product-modal')">Cancel</button>
                <button class="btn btn-primary" onclick="saveProduct()">Save Product</button>
            </div>
        </div>
    </div>

    <!-- Ticket Modal -->
    <div class="modal-overlay" id="ticket-modal">
        <div class="modal">
            <div class="modal-header">
                <span class="modal-title" id="ticket-modal-title">New Ticket</span>
                <button class="modal-close" onclick="closeModal('ticket-modal')">&times;</button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="ticket-id">
                <div class="form-group">
                    <label class="form-label">Product *</label>
                    <select class="form-select" id="ticket-product"></select>
                </div>
                <div class="form-group">
                    <label class="form-label">Title</label>
                    <input type="text" class="form-input" id="ticket-title" placeholder="Brief summary">
                </div>
                <div class="form-group">
                    <label class="form-label">Content *</label>
                    <textarea class="form-textarea" id="ticket-content" placeholder="Describe the feedback..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Source</label>
                    <select class="form-select" id="ticket-source">
                        <option value="manual">Manual Entry</option>
                        <option value="email">Email</option>
                        <option value="discord">Discord</option>
                        <option value="slack">Slack</option>
                        <option value="github">GitHub</option>
                        <option value="twitter">Twitter/X</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Priority/Severity</label>
                    <select class="form-select" id="ticket-priority">
                        <option value="">Auto-detect (AI)</option>
                        <option value="critical">🔴 Critical - System down, data loss</option>
                        <option value="high">🟠 High - Major feature broken</option>
                        <option value="medium">🟡 Medium - Minor issue, workaround exists</option>
                        <option value="low">🟢 Low - Nice to have, cosmetic</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select class="form-select" id="ticket-category">
                        <option value="">Auto-detect (AI)</option>
                        <option value="bug">🐛 Bug Report</option>
                        <option value="feature_request">✨ Feature Request</option>
                        <option value="ux_issue">🎨 UX Issue</option>
                        <option value="performance">⚡ Performance</option>
                        <option value="documentation">📚 Documentation</option>
                        <option value="pricing">💰 Pricing</option>
                        <option value="praise">🎉 Praise</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Author Name</label>
                    <input type="text" class="form-input" id="ticket-author" placeholder="Customer name">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="closeModal('ticket-modal')">Cancel</button>
                <button class="btn btn-success" onclick="saveTicket()">Create Ticket</button>
            </div>
        </div>
    </div>

    <!-- Feedback Detail Modal -->
    <div class="modal-overlay" id="detail-modal">
        <div class="modal" style="max-width: 700px;">
            <div class="modal-header">
                <span class="modal-title" id="detail-title">Feedback Details</span>
                <button class="modal-close" onclick="closeModal('detail-modal')">&times;</button>
            </div>
            <div class="modal-body">
                <!-- View Mode -->
                <div id="detail-view-mode">
                    <div id="detail-badges" style="margin-bottom: 15px;"></div>
                    <div id="detail-content" style="line-height: 1.7; margin-bottom: 20px;"></div>
                    <div id="detail-meta" style="background: #f7fafc; padding: 15px; border-radius: 8px;"></div>
                    <div class="status-buttons" id="detail-status-buttons"></div>
                </div>
                <!-- Edit Mode -->
                <div id="detail-edit-mode" style="display: none;">
                    <div class="form-group">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-input" id="edit-title">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Content</label>
                        <textarea class="form-textarea" id="edit-content" style="min-height: 150px;"></textarea>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label class="form-label">Priority</label>
                            <select class="form-select" id="edit-priority">
                                <option value="critical">🔴 Critical</option>
                                <option value="high">🟠 High</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="low">🟢 Low</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Category</label>
                            <select class="form-select" id="edit-category">
                                <option value="bug">🐛 Bug</option>
                                <option value="feature_request">✨ Feature Request</option>
                                <option value="ux_issue">🎨 UX Issue</option>
                                <option value="performance">⚡ Performance</option>
                                <option value="documentation">📚 Documentation</option>
                                <option value="pricing">💰 Pricing</option>
                                <option value="praise">🎉 Praise</option>
                                <option value="other">📋 Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select class="form-select" id="edit-status">
                            <option value="new">📥 New</option>
                            <option value="unprocessed">⏳ Unprocessed</option>
                            <option value="processed">✅ Processed</option>
                            <option value="reviewing">👀 Reviewing</option>
                            <option value="planned">📋 Planned</option>
                            <option value="in_development">🔧 In Development</option>
                            <option value="resolved">✅ Resolved</option>
                            <option value="closed">🔒 Closed</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-danger btn-sm" id="detail-delete-btn" onclick="deleteCurrentFeedback()">Delete</button>
                <div style="flex:1;"></div>
                <button class="btn btn-secondary" id="detail-edit-btn" onclick="toggleEditMode()">Edit</button>
                <button class="btn btn-success" id="detail-save-btn" style="display:none;" onclick="saveEditedFeedback()">Save Changes</button>
                <button class="btn btn-outline" id="detail-cancel-btn" style="display:none;" onclick="cancelEdit()">Cancel</button>
                <button class="btn btn-outline" id="detail-close-btn" onclick="closeModal('detail-modal')">Close</button>
            </div>
        </div>
    </div>

    <!-- Toast -->
    <div class="toast" id="toast"></div>

    <script>
        const API = window.location.origin;
        let products = [];
        let currentProduct = null;
        let allFeedback = [];
        let sources = [];
        let currentFeedbackId = null;
        let isSaving = false; // Guard against double submissions

        // Initialize
        loadProducts();
        loadSources();

        async function loadProducts() {
            const container = document.getElementById('products');
            container.innerHTML = '<div class="loading">Loading products...</div>';
            try {
                const res = await fetch(API + '/products');
                products = await res.json();
                renderProducts();
            } catch (e) {
                container.innerHTML = '<div class="empty-state">Error loading products</div>';
            }
        }

        async function loadSources() {
            try {
                const res = await fetch(API + '/sources');
                sources = await res.json();
                const select = document.getElementById('filter-source');
                select.innerHTML = '<option value="">All Sources</option>';
                sources.forEach(s => {
                    select.innerHTML += \`<option value="\${s.name}">\${s.name}</option>\`;
                });
            } catch (e) {}
        }

        async function renderProducts() {
            const container = document.getElementById('products');
            if (products.length === 0) {
                container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📦</div>No products yet. Create one to get started!</div>';
                return;
            }
            container.innerHTML = '';

            // Load all stats in parallel, then render
            const statsPromises = products.map(p => loadStats(p.id));
            const allStats = await Promise.all(statsPromises);

            products.forEach((p, index) => {
                const stats = allStats[index];
                const card = document.createElement('div');
                card.className = 'product-card' + (currentProduct?.id === p.id ? ' selected' : '');
                card.onclick = () => selectProduct(p);
                card.innerHTML = \`
                    <div class="product-name">\${p.name}</div>
                    <div class="product-desc">\${p.description || 'No description'}</div>
                    <div class="product-stats">
                        <div class="stat"><div class="stat-value">\${stats.total || 0}</div><div class="stat-label">Total</div></div>
                        <div class="stat"><div class="stat-value" style="color:#48bb78">\${stats.positive || 0}</div><div class="stat-label">Positive</div></div>
                        <div class="stat"><div class="stat-value" style="color:#f56565">\${stats.negative || 0}</div><div class="stat-label">Negative</div></div>
                    </div>
                \`;
                container.appendChild(card);
            });
        }

        async function loadStats(productId) {
            try {
                const res = await fetch(API + '/products/' + productId + '/stats');
                return await res.json();
            } catch { return {}; }
        }

        function selectProduct(p) {
            currentProduct = p;
            document.querySelectorAll('.product-card').forEach(c => c.classList.remove('selected'));
            event.currentTarget.classList.add('selected');
            document.getElementById('main-content').style.display = 'block';
            loadFeedback();
            loadAISummary();
        }

        async function loadAISummary() {
            if (!currentProduct) return;

            const container = document.getElementById('ai-summary-content');
            container.innerHTML = \`
                <div class="summary-loading">
                    <div class="summary-loading-spinner"></div>
                    <div>Analyzing feedback...</div>
                </div>
            \`;

            try {
                const res = await fetch(API + '/products/' + currentProduct.id + '/ai-summary');
                const data = await res.json();
                renderAISummary(data);
            } catch (e) {
                container.innerHTML = '<div class="summary-loading">Failed to load AI summary</div>';
            }
        }

        function renderAISummary(data) {
            const container = document.getElementById('ai-summary-content');

            // Sentiment percentages
            const total = data.sentiment_breakdown.positive + data.sentiment_breakdown.negative + data.sentiment_breakdown.neutral;
            const posPercent = total > 0 ? Math.round((data.sentiment_breakdown.positive / total) * 100) : 0;
            const negPercent = total > 0 ? Math.round((data.sentiment_breakdown.negative / total) * 100) : 0;
            const neutPercent = total > 0 ? Math.round((data.sentiment_breakdown.neutral / total) * 100) : 0;

            // Handle themes as string or array
            let themesArray = [];
            if (data.themes) {
                if (Array.isArray(data.themes)) {
                    themesArray = data.themes;
                } else if (typeof data.themes === 'string') {
                    themesArray = data.themes.split(',').map(t => t.trim()).filter(t => t);
                }
            }

            container.innerHTML = \`
                <div class="summary-section">
                    <div class="summary-section-title">Executive Summary</div>
                    <div class="summary-text">\${data.summary}</div>
                </div>

                \${themesArray.length > 0 ? \`
                <div class="summary-section">
                    <div class="summary-section-title">Top Themes</div>
                    <div class="summary-themes">
                        \${themesArray.map(t => \`<span class="theme-tag">\${t}</span>\`).join('')}
                    </div>
                </div>
                \` : ''}

                <div class="summary-section">
                    <div class="summary-section-title">Sentiment Breakdown</div>
                    <div class="summary-stat-row">
                        <span class="summary-stat-label">😊 Positive</span>
                        <span class="summary-stat-value positive">\${data.sentiment_breakdown.positive} (\${posPercent}%)</span>
                    </div>
                    <div class="summary-stat-row">
                        <span class="summary-stat-label">😐 Neutral</span>
                        <span class="summary-stat-value neutral">\${data.sentiment_breakdown.neutral} (\${neutPercent}%)</span>
                    </div>
                    <div class="summary-stat-row">
                        <span class="summary-stat-label">😞 Negative</span>
                        <span class="summary-stat-value negative">\${data.sentiment_breakdown.negative} (\${negPercent}%)</span>
                    </div>
                </div>

                \${data.critical_issues && data.critical_issues.length > 0 ? \`
                <div class="summary-section">
                    <div class="summary-section-title">🚨 Critical Issues</div>
                    \${data.critical_issues.map(issue => \`
                        <div class="critical-item" onclick="openDetail(\${issue.id})">
                            <span class="priority-dot \${issue.priority}"></span>
                            <span class="critical-item-title">\${issue.title}</span>
                        </div>
                    \`).join('')}
                </div>
                \` : ''}

                \${data.recent_tickets && data.recent_tickets.length > 0 ? \`
                <div class="summary-section">
                    <div class="summary-section-title">📅 Recent Activity</div>
                    \${data.recent_tickets.map(ticket => \`
                        <div class="recent-item" onclick="openDetail(\${ticket.id})">
                            <span class="recent-item-title">\${ticket.title}</span>
                            <span class="recent-item-date">\${new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                    \`).join('')}
                </div>
                \` : ''}

                <div style="text-align: center; margin-top: 15px;">
                    <button class="btn btn-outline btn-sm" onclick="loadAISummary()">🔄 Refresh</button>
                </div>
            \`;
        }

        async function loadFeedback() {
            if (!currentProduct) return;
            try {
                const res = await fetch(API + '/products/' + currentProduct.id + '/feedback?limit=200');
                allFeedback = await res.json();
                applyFilters();
            } catch (e) {
                showToast('Error loading feedback', 'error');
            }
        }

        function applyFilters() {
            const source = document.getElementById('filter-source').value;
            const sentiment = document.getElementById('filter-sentiment').value;
            const category = document.getElementById('filter-category').value;
            const priority = document.getElementById('filter-priority').value;
            const feedbackType = document.getElementById('filter-type').value;
            const search = document.getElementById('search-input').value.toLowerCase();

            let filtered = [...allFeedback];
            if (source) filtered = filtered.filter(f => sources.find(s => s.id === f.source_id)?.name === source);
            if (sentiment) filtered = filtered.filter(f => f.sentiment_label === sentiment);
            if (category) filtered = filtered.filter(f => f.category === category);
            if (priority) filtered = filtered.filter(f => f.priority === priority);
            if (feedbackType) filtered = filtered.filter(f => f.feedback_type === feedbackType);
            if (search) filtered = filtered.filter(f =>
                (f.title || '').toLowerCase().includes(search) ||
                (f.content || '').toLowerCase().includes(search)
            );

            renderKanban(filtered);
            renderList(filtered);
        }

        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3, null: 4 };
        const sentimentOrder = { negative: 0, neutral: 1, positive: 2, null: 3 };

        function sortByPriority(items) {
            return items.sort((a, b) => {
                // First sort by priority (critical > high > medium > low)
                const pa = priorityOrder[a.priority] ?? 4;
                const pb = priorityOrder[b.priority] ?? 4;
                if (pa !== pb) return pa - pb;

                // Then sort by sentiment (negative at top, positive at bottom)
                const sa = sentimentOrder[a.sentiment_label] ?? 3;
                const sb = sentimentOrder[b.sentiment_label] ?? 3;
                if (sa !== sb) return sa - sb;

                // Finally by date (newest first)
                return new Date(b.created_at) - new Date(a.created_at);
            });
        }

        function renderKanban(feedback) {
            const todo = sortByPriority(feedback.filter(f => ['new', 'unprocessed', 'processed'].includes(f.status)));
            const inProgress = sortByPriority(feedback.filter(f => ['reviewing', 'planned', 'in_development'].includes(f.status)));
            const done = sortByPriority(feedback.filter(f => ['resolved', 'closed'].includes(f.status)));

            document.getElementById('kanban-board').innerHTML = \`
                <div class="kanban-column">
                    <div class="kanban-header">
                        <span class="kanban-title">📥 TODO</span>
                        <span class="kanban-count">\${todo.length}</span>
                    </div>
                    <div class="kanban-cards">\${todo.map(f => feedbackCard(f)).join('')}</div>
                </div>
                <div class="kanban-column">
                    <div class="kanban-header">
                        <span class="kanban-title">🔄 In Progress</span>
                        <span class="kanban-count">\${inProgress.length}</span>
                    </div>
                    <div class="kanban-cards">\${inProgress.map(f => feedbackCard(f)).join('')}</div>
                </div>
                <div class="kanban-column">
                    <div class="kanban-header">
                        <span class="kanban-title">✅ Done</span>
                        <span class="kanban-count">\${done.length}</span>
                    </div>
                    <div class="kanban-cards">\${done.map(f => feedbackCard(f)).join('')}</div>
                </div>
            \`;
        }

        function feedbackCard(f) {
            const src = sources.find(s => s.id === f.source_id)?.name || 'unknown';
            const priorityIcons = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' };
            const priorityIcon = priorityIcons[f.priority] || '';
            const typeLabel = f.feedback_type === 'internal' ? '🏢' : '👥';
            return \`
                <div class="feedback-card \${f.sentiment_label || ''}" onclick="openDetail(\${f.id})">
                    <div class="feedback-title">\${priorityIcon} \${f.title || 'Untitled'}</div>
                    <div class="feedback-preview">\${(f.content || '').substring(0, 80)}...</div>
                    <div class="feedback-badges">
                        <span class="badge badge-\${f.feedback_type || 'external'}">\${typeLabel} \${f.feedback_type || 'external'}</span>
                        <span class="badge badge-source">\${src}</span>
                        \${f.priority ? \`<span class="badge badge-priority-\${f.priority}">\${f.priority}</span>\` : ''}
                    </div>
                </div>
            \`;
        }

        function renderList(feedback) {
            const container = document.getElementById('feedback-list');
            if (feedback.length === 0) {
                container.innerHTML = '<div class="empty-state">No feedback found</div>';
                return;
            }
            const sorted = sortByPriority([...feedback]);
            const priorityIcons = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' };
            container.innerHTML = sorted.map(f => {
                const src = sources.find(s => s.id === f.source_id)?.name || 'unknown';
                const priorityIcon = priorityIcons[f.priority] || '';
                const typeLabel = f.feedback_type === 'internal' ? '🏢' : '👥';
                return \`
                    <div class="feedback-item \${f.sentiment_label || ''}" onclick="openDetail(\${f.id})">
                        <div class="feedback-item-header">
                            <div class="feedback-title">\${priorityIcon} \${f.title || 'Untitled'}</div>
                            <div class="feedback-badges">
                                <span class="badge badge-\${f.feedback_type || 'external'}">\${typeLabel} \${f.feedback_type || 'external'}</span>
                                <span class="badge badge-source">\${src}</span>
                                \${f.priority ? \`<span class="badge badge-priority-\${f.priority}">\${f.priority}</span>\` : ''}
                            </div>
                        </div>
                        <div class="feedback-preview">\${(f.content || '').substring(0, 200)}...</div>
                        <div class="feedback-meta">
                            <span>\${f.author_name || 'Anonymous'}</span>
                            <span>\${new Date(f.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                \`;
            }).join('');
        }

        function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
            event.target.classList.add('active');
            document.getElementById('tab-' + tab).style.display = 'block';
        }

        function handleSearch(e) {
            if (e.key === 'Enter') applyFilters();
        }

        async function semanticSearch() {
            const q = document.getElementById('search-input').value;
            if (!q || !currentProduct) return;
            try {
                const res = await fetch(API + '/products/' + currentProduct.id + '/semantic-search?q=' + encodeURIComponent(q));
                allFeedback = await res.json();
                applyFilters();
                showToast('AI search complete');
            } catch (e) {
                showToast('Search failed', 'error');
            }
        }

        function clearFilters() {
            document.getElementById('search-input').value = '';
            document.getElementById('filter-source').value = '';
            document.getElementById('filter-sentiment').value = '';
            document.getElementById('filter-category').value = '';
            document.getElementById('filter-priority').value = '';
            document.getElementById('filter-type').value = '';
            loadFeedback();
        }

        // Modals
        function openProductModal(product = null) {
            document.getElementById('product-modal-title').textContent = product ? 'Edit Product' : 'New Product';
            document.getElementById('product-id').value = product?.id || '';
            document.getElementById('product-name').value = product?.name || '';
            document.getElementById('product-description').value = product?.description || '';
            document.getElementById('product-category').value = product?.category || '';
            document.getElementById('product-modal').classList.add('active');
        }

        function openTicketModal() {
            document.getElementById('ticket-modal-title').textContent = 'New Ticket';
            document.getElementById('ticket-id').value = '';
            document.getElementById('ticket-title').value = '';
            document.getElementById('ticket-content').value = '';
            document.getElementById('ticket-author').value = '';
            document.getElementById('ticket-priority').value = '';
            document.getElementById('ticket-category').value = '';
            document.getElementById('ticket-source').value = 'manual';
            const select = document.getElementById('ticket-product');
            select.innerHTML = products.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join('');
            if (currentProduct) select.value = currentProduct.id;
            document.getElementById('ticket-modal').classList.add('active');
        }

        async function openDetail(id) {
            currentFeedbackId = id;
            const f = allFeedback.find(x => x.id === id);
            if (!f) return;
            const src = sources.find(s => s.id === f.source_id)?.name || 'unknown';

            // Reset to view mode
            document.getElementById('detail-view-mode').style.display = 'block';
            document.getElementById('detail-edit-mode').style.display = 'none';
            document.getElementById('detail-edit-btn').style.display = 'inline-block';
            document.getElementById('detail-save-btn').style.display = 'none';
            document.getElementById('detail-cancel-btn').style.display = 'none';
            document.getElementById('detail-close-btn').style.display = 'inline-block';
            document.getElementById('detail-delete-btn').style.display = 'inline-block';

            document.getElementById('detail-title').textContent = f.title || 'Feedback #' + f.id;
            document.getElementById('detail-badges').innerHTML = \`
                <span class="badge badge-source">\${src}</span>
                \${f.sentiment_label ? \`<span class="badge badge-\${f.sentiment_label}">\${f.sentiment_label}</span>\` : ''}
                \${f.category ? \`<span class="badge badge-category">\${f.category}</span>\` : ''}
                \${f.priority ? \`<span class="badge badge-priority-\${f.priority}">\${f.priority}</span>\` : ''}
            \`;
            document.getElementById('detail-content').textContent = f.content;
            document.getElementById('detail-meta').innerHTML = \`
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px;">
                    <div><strong>Author:</strong> \${f.author_name || 'Anonymous'}</div>
                    <div><strong>Email:</strong> \${f.author_email || '-'}</div>
                    <div><strong>Status:</strong> \${f.status}</div>
                    <div><strong>Created:</strong> \${new Date(f.created_at).toLocaleString()}</div>
                </div>
            \`;
            document.getElementById('detail-status-buttons').innerHTML = \`
                <span style="font-size:12px;color:#718096;margin-right:10px;">Move to:</span>
                <button class="status-btn" onclick="updateStatus(\${f.id}, 'new')">TODO</button>
                <button class="status-btn" onclick="updateStatus(\${f.id}, 'reviewing')">Reviewing</button>
                <button class="status-btn" onclick="updateStatus(\${f.id}, 'planned')">Planned</button>
                <button class="status-btn" onclick="updateStatus(\${f.id}, 'resolved')">Resolved</button>
                <button class="status-btn" onclick="updateStatus(\${f.id}, 'closed')">Closed</button>
            \`;
            document.getElementById('detail-modal').classList.add('active');
        }

        function closeModal(id) {
            document.getElementById(id).classList.remove('active');
        }

        async function saveProduct() {
            if (isSaving) return; // Prevent double submission
            const id = document.getElementById('product-id').value;
            const data = {
                name: document.getElementById('product-name').value,
                description: document.getElementById('product-description').value,
                category: document.getElementById('product-category').value
            };
            if (!data.name) { showToast('Name is required', 'error'); return; }

            isSaving = true;
            const btn = document.querySelector('#product-modal .btn-primary');
            btn.disabled = true;
            btn.textContent = 'Saving...';

            try {
                const method = id ? 'PUT' : 'POST';
                const url = id ? API + '/products/' + id : API + '/products';
                await fetch(url, { method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
                closeModal('product-modal');
                loadProducts();
                showToast(id ? 'Product updated' : 'Product created', 'success');
            } catch (e) {
                showToast('Error saving product', 'error');
            } finally {
                isSaving = false;
                btn.disabled = false;
                btn.textContent = 'Save Product';
            }
        }

        async function saveTicket() {
            if (isSaving) return; // Prevent double submission
            const data = {
                product_id: parseInt(document.getElementById('ticket-product').value),
                source_name: document.getElementById('ticket-source').value,
                title: document.getElementById('ticket-title').value,
                content: document.getElementById('ticket-content').value,
                author_name: document.getElementById('ticket-author').value,
                priority: document.getElementById('ticket-priority').value || undefined,
                category: document.getElementById('ticket-category').value || undefined
            };
            if (!data.content) { showToast('Content is required', 'error'); return; }

            isSaving = true;
            const btn = document.querySelector('#ticket-modal .btn-success');
            btn.disabled = true;
            btn.textContent = 'Creating...';

            try {
                await fetch(API + '/feedback', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
                closeModal('ticket-modal');
                loadFeedback();
                const msg = data.priority ? 'Ticket created!' : 'Ticket created - processing with AI...';
                showToast(msg, 'success');
            } catch (e) {
                showToast('Error creating ticket', 'error');
            } finally {
                isSaving = false;
                btn.disabled = false;
                btn.textContent = 'Create Ticket';
            }
        }

        function toggleEditMode() {
            const viewMode = document.getElementById('detail-view-mode');
            const editMode = document.getElementById('detail-edit-mode');
            const editBtn = document.getElementById('detail-edit-btn');
            const saveBtn = document.getElementById('detail-save-btn');
            const cancelBtn = document.getElementById('detail-cancel-btn');
            const closeBtn = document.getElementById('detail-close-btn');
            const deleteBtn = document.getElementById('detail-delete-btn');

            // Populate edit fields with current values
            const f = allFeedback.find(x => x.id === currentFeedbackId);
            if (f) {
                document.getElementById('edit-title').value = f.title || '';
                document.getElementById('edit-content').value = f.content || '';
                document.getElementById('edit-priority').value = f.priority || 'medium';
                document.getElementById('edit-category').value = f.category || 'other';
                document.getElementById('edit-status').value = f.status || 'new';
            }

            viewMode.style.display = 'none';
            editMode.style.display = 'block';
            editBtn.style.display = 'none';
            closeBtn.style.display = 'none';
            deleteBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
        }

        function cancelEdit() {
            const viewMode = document.getElementById('detail-view-mode');
            const editMode = document.getElementById('detail-edit-mode');
            const editBtn = document.getElementById('detail-edit-btn');
            const saveBtn = document.getElementById('detail-save-btn');
            const cancelBtn = document.getElementById('detail-cancel-btn');
            const closeBtn = document.getElementById('detail-close-btn');
            const deleteBtn = document.getElementById('detail-delete-btn');

            viewMode.style.display = 'block';
            editMode.style.display = 'none';
            editBtn.style.display = 'inline-block';
            closeBtn.style.display = 'inline-block';
            deleteBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
        }

        async function saveEditedFeedback() {
            if (isSaving || !currentFeedbackId) return;

            const data = {
                title: document.getElementById('edit-title').value,
                content: document.getElementById('edit-content').value,
                priority: document.getElementById('edit-priority').value,
                category: document.getElementById('edit-category').value,
                status: document.getElementById('edit-status').value
            };

            isSaving = true;
            const btn = document.getElementById('detail-save-btn');
            btn.disabled = true;
            btn.textContent = 'Saving...';

            try {
                await fetch(API + '/feedback/' + currentFeedbackId, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                cancelEdit();
                closeModal('detail-modal');
                loadFeedback();
                showToast('Ticket updated!', 'success');
            } catch (e) {
                showToast('Error saving changes', 'error');
            } finally {
                isSaving = false;
                btn.disabled = false;
                btn.textContent = 'Save Changes';
            }
        }

        async function updateStatus(id, status) {
            try {
                await fetch(API + '/feedback/' + id + '/status', {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ status })
                });
                closeModal('detail-modal');
                loadFeedback();
                showToast('Status updated', 'success');
            } catch (e) {
                showToast('Error updating status', 'error');
            }
        }

        async function deleteCurrentFeedback() {
            if (!currentFeedbackId || !confirm('Delete this feedback?')) return;
            try {
                await fetch(API + '/feedback/' + currentFeedbackId, { method: 'DELETE' });
                closeModal('detail-modal');
                loadFeedback();
                showToast('Feedback deleted', 'success');
            } catch (e) {
                showToast('Error deleting', 'error');
            }
        }


        async function loadMockData() {
            showToast('Loading demo data...');
            try {
                await fetch(API + '/load-mock-data', { method: 'POST' });
                loadProducts();
                showToast('Demo data loaded!', 'success');
            } catch (e) {
                showToast('Error loading data', 'error');
            }
        }

        function showToast(msg, type = '') {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.className = 'toast show ' + type;
            setTimeout(() => toast.className = 'toast', 3000);
        }

        // Keyboard
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            }
        });
    </script>
</body>
</html>`;
