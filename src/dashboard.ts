export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PM Feedback Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f7fa;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        h1 {
            color: #1a202c;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        h2 {
            margin-bottom: 15px;
            color: #2d3748;
        }

        .header-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .actions {
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .btn {
            background: #f6821f;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s;
        }

        .btn:hover {
            background: #e57310;
        }

        .btn-secondary {
            background: #4299e1;
        }

        .btn-secondary:hover {
            background: #3182ce;
        }

        .btn-small {
            padding: 6px 12px;
            font-size: 12px;
        }

        .btn-outline {
            background: transparent;
            border: 2px solid #e2e8f0;
            color: #4a5568;
        }

        .btn-outline:hover {
            background: #f7fafc;
            border-color: #cbd5e0;
        }

        .btn-outline.active {
            background: #4299e1;
            border-color: #4299e1;
            color: white;
        }

        #status {
            color: #48bb78;
            font-size: 14px;
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .product-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: all 0.2s;
            border: 2px solid transparent;
        }

        .product-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .product-card.selected {
            border-color: #f6821f;
        }

        .product-name {
            font-size: 18px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 6px;
        }

        .product-desc {
            color: #718096;
            font-size: 13px;
            margin-bottom: 12px;
        }

        .stats {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .stat {
            flex: 1;
            min-width: 60px;
            text-align: center;
        }

        .stat-label {
            font-size: 10px;
            color: #a0aec0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-value {
            font-size: 22px;
            font-weight: 700;
            color: #2d3748;
        }

        .sentiment-bar {
            height: 6px;
            background: #e2e8f0;
            border-radius: 3px;
            margin: 12px 0;
            overflow: hidden;
            display: flex;
        }

        .sentiment-bar-fill {
            height: 100%;
            transition: width 0.3s;
        }

        .sentiment-bar-fill.positive { background: #48bb78; }
        .sentiment-bar-fill.negative { background: #f56565; }
        .sentiment-bar-fill.neutral { background: #ed8936; }

        .feedback-panel {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            overflow: hidden;
        }

        .feedback-header {
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
        }

        .search-row {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }

        .search-box {
            flex: 1;
            padding: 10px 14px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            font-size: 14px;
        }

        .search-box:focus {
            outline: none;
            border-color: #f6821f;
        }

        .filters-row {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
        }

        .filter-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .filter-label {
            font-size: 12px;
            color: #718096;
            font-weight: 500;
        }

        .filter-select {
            padding: 6px 10px;
            border: 2px solid #e2e8f0;
            border-radius: 4px;
            font-size: 13px;
            background: white;
            cursor: pointer;
        }

        .filter-select:focus {
            outline: none;
            border-color: #4299e1;
        }

        .sort-group {
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .feedback-list {
            max-height: 600px;
            overflow-y: auto;
        }

        .feedback-item {
            border-left: 4px solid #cbd5e0;
            padding: 15px 20px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            transition: background 0.15s;
        }

        .feedback-item:hover {
            background: #f7fafc;
        }

        .feedback-item:last-child {
            border-bottom: none;
        }

        .feedback-item.positive { border-left-color: #48bb78; }
        .feedback-item.negative { border-left-color: #f56565; }
        .feedback-item.neutral { border-left-color: #ed8936; }

        .feedback-item-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 6px;
            gap: 10px;
        }

        .feedback-title {
            font-weight: 600;
            color: #2d3748;
            font-size: 14px;
        }

        .feedback-badges {
            display: flex;
            gap: 5px;
            flex-shrink: 0;
        }

        .badge {
            font-size: 10px;
            padding: 3px 8px;
            border-radius: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .badge-positive { background: #c6f6d5; color: #22543d; }
        .badge-negative { background: #fed7d7; color: #742a2a; }
        .badge-neutral { background: #feebc8; color: #7c2d12; }
        .badge-category { background: #e9d8fd; color: #553c9a; }
        .badge-priority-low { background: #e2e8f0; color: #4a5568; }
        .badge-priority-medium { background: #feebc8; color: #7c2d12; }
        .badge-priority-high { background: #fed7d7; color: #742a2a; }
        .badge-priority-critical { background: #742a2a; color: white; }

        .feedback-preview {
            color: #4a5568;
            font-size: 13px;
            line-height: 1.5;
            margin-bottom: 6px;
        }

        .feedback-meta {
            font-size: 11px;
            color: #a0aec0;
        }

        .loading {
            text-align: center;
            padding: 40px;
            color: #718096;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #718096;
        }

        .empty-state-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }

        /* Modal */
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .modal-overlay.active {
            display: flex;
        }

        .modal {
            background: white;
            border-radius: 12px;
            max-width: 700px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: start;
        }

        .modal-title {
            font-size: 18px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 8px;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #a0aec0;
            padding: 0;
            line-height: 1;
        }

        .modal-close:hover {
            color: #4a5568;
        }

        .modal-body {
            padding: 20px;
            overflow-y: auto;
            max-height: 60vh;
        }

        .modal-content {
            color: #4a5568;
            font-size: 15px;
            line-height: 1.7;
            margin-bottom: 20px;
            white-space: pre-wrap;
        }

        .modal-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            background: #f7fafc;
            padding: 15px;
            border-radius: 8px;
        }

        .detail-item {
            display: flex;
            flex-direction: column;
        }

        .detail-label {
            font-size: 11px;
            color: #a0aec0;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .detail-value {
            font-size: 14px;
            color: #2d3748;
            font-weight: 500;
        }

        .powered-by {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            color: #a0aec0;
            font-size: 12px;
        }

        .powered-by a {
            color: #f6821f;
            text-decoration: none;
        }

        .count-badge {
            background: #e2e8f0;
            color: #4a5568;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header-actions">
            <h1>📊 PM Feedback Dashboard</h1>
            <div class="actions">
                <button class="btn" onclick="loadMockData()">+ Load Mock Data</button>
                <button class="btn btn-secondary" onclick="loadProducts()">↻ Refresh</button>
                <span id="status"></span>
            </div>
        </div>

        <div id="products" class="products-grid"></div>

        <div id="feedback-section" style="display: none;">
            <div class="feedback-panel">
                <div class="feedback-header">
                    <h2 id="product-title">Feedback</h2>

                    <div class="search-row">
                        <input type="text" class="search-box" id="search-input" placeholder="Search feedback..." onkeyup="handleSearch(event)">
                        <button class="btn btn-secondary" onclick="semanticSearch()">🔍 AI Search</button>
                        <button class="btn btn-outline" onclick="clearFilters()">Clear</button>
                    </div>

                    <div class="filters-row">
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
                                <option value="feature_request">Feature Request</option>
                                <option value="ux_issue">UX Issue</option>
                                <option value="performance">Performance</option>
                                <option value="documentation">Documentation</option>
                                <option value="pricing">Pricing</option>
                                <option value="praise">Praise</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <span class="filter-label">Priority:</span>
                            <select class="filter-select" id="filter-priority" onchange="applyFilters()">
                                <option value="">All</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        <div class="sort-group">
                            <span class="filter-label">Sort:</span>
                            <select class="filter-select" id="sort-by" onchange="applyFilters()">
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="sentiment-high">Most Positive</option>
                                <option value="sentiment-low">Most Negative</option>
                                <option value="priority">Priority</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div id="feedback-list" class="feedback-list"></div>
            </div>
        </div>

        <div class="powered-by">
            Powered by <a href="https://developers.cloudflare.com/">Cloudflare</a> Workers, D1, Workers AI, Vectorize & Workflows
        </div>
    </div>

    <!-- Feedback Detail Modal -->
    <div class="modal-overlay" id="modal-overlay" onclick="closeModal(event)">
        <div class="modal" onclick="event.stopPropagation()">
            <div class="modal-header">
                <div>
                    <div class="modal-title" id="modal-title"></div>
                    <div class="feedback-badges" id="modal-badges"></div>
                </div>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-content" id="modal-content"></div>
                <div class="modal-details" id="modal-details"></div>
            </div>
        </div>
    </div>

    <script>
        const API_BASE = window.location.origin;
        let currentProductId = null;
        let currentProductName = '';
        let allFeedback = [];

        async function loadMockData() {
            const status = document.getElementById('status');
            status.textContent = 'Loading mock data...';

            try {
                const response = await fetch(\`\${API_BASE}/load-mock-data\`, { method: 'POST' });
                const data = await response.json();
                status.textContent = '✓ ' + data.results.length + ' items loaded! Processing...';
                setTimeout(() => {
                    status.textContent = '';
                    loadProducts();
                }, 3000);
            } catch (error) {
                status.textContent = '✗ Error loading data';
                console.error(error);
            }
        }

        async function loadProducts() {
            const container = document.getElementById('products');
            container.innerHTML = '<div class="loading">Loading products...</div>';

            try {
                const response = await fetch(\`\${API_BASE}/products\`);
                const products = await response.json();

                container.innerHTML = '';
                for (const product of products) {
                    const stats = await loadStats(product.id);
                    const card = createProductCard(product, stats);
                    container.appendChild(card);
                }
            } catch (error) {
                container.innerHTML = '<div class="loading">Error loading products</div>';
                console.error(error);
            }
        }

        async function loadStats(productId) {
            try {
                const response = await fetch(\`\${API_BASE}/products/\${productId}/stats\`);
                return await response.json();
            } catch {
                return { total: 0, positive: 0, negative: 0, neutral: 0 };
            }
        }

        function createProductCard(product, stats) {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.id = 'product-card-' + product.id;
            card.onclick = () => selectProduct(product.id, product.name);

            const total = stats.total || 0;
            const posPercent = total > 0 ? (stats.positive / total * 100) : 0;
            const negPercent = total > 0 ? (stats.negative / total * 100) : 0;
            const neutralPercent = 100 - posPercent - negPercent;

            card.innerHTML = \`
                <div class="product-name">\${product.name}</div>
                <div class="product-desc">\${product.description || 'No description'}</div>
                <div class="sentiment-bar">
                    <div class="sentiment-bar-fill positive" style="width: \${posPercent}%"></div>
                    <div class="sentiment-bar-fill neutral" style="width: \${neutralPercent}%"></div>
                    <div class="sentiment-bar-fill negative" style="width: \${negPercent}%"></div>
                </div>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-value">\${total}</div>
                        <div class="stat-label">Total</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" style="color: #48bb78">\${stats.positive || 0}</div>
                        <div class="stat-label">Positive</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" style="color: #f56565">\${stats.negative || 0}</div>
                        <div class="stat-label">Negative</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" style="color: #ed8936">\${stats.features || 0}</div>
                        <div class="stat-label">Features</div>
                    </div>
                </div>
            \`;

            return card;
        }

        function selectProduct(productId, productName) {
            // Update selection UI
            document.querySelectorAll('.product-card').forEach(c => c.classList.remove('selected'));
            document.getElementById('product-card-' + productId)?.classList.add('selected');

            currentProductId = productId;
            currentProductName = productName;
            loadFeedback(productId, productName);
        }

        async function loadFeedback(productId, productName) {
            document.getElementById('product-title').textContent = productName;
            document.getElementById('feedback-section').style.display = 'block';
            document.getElementById('feedback-list').innerHTML = '<div class="loading">Loading feedback...</div>';

            try {
                const response = await fetch(\`\${API_BASE}/products/\${productId}/feedback?limit=100\`);
                allFeedback = await response.json();
                applyFilters();
            } catch (error) {
                document.getElementById('feedback-list').innerHTML = '<div class="loading">Error loading feedback</div>';
                console.error(error);
            }
        }

        function handleSearch(event) {
            if (event.key === 'Enter') {
                const query = document.getElementById('search-input').value;
                if (query.length > 2) {
                    semanticSearch();
                } else {
                    applyFilters();
                }
            }
        }

        async function semanticSearch() {
            const query = document.getElementById('search-input').value;
            if (!query || !currentProductId) return;

            document.getElementById('feedback-list').innerHTML = '<div class="loading">Searching with AI...</div>';

            try {
                const response = await fetch(\`\${API_BASE}/products/\${currentProductId}/semantic-search?q=\${encodeURIComponent(query)}\`);
                const results = await response.json();
                allFeedback = results;
                displayFeedback(results);
            } catch (error) {
                document.getElementById('feedback-list').innerHTML = '<div class="loading">Error searching</div>';
                console.error(error);
            }
        }

        function applyFilters() {
            const sentiment = document.getElementById('filter-sentiment').value;
            const category = document.getElementById('filter-category').value;
            const priority = document.getElementById('filter-priority').value;
            const sortBy = document.getElementById('sort-by').value;
            const searchText = document.getElementById('search-input').value.toLowerCase();

            let filtered = [...allFeedback];

            // Text search
            if (searchText && searchText.length > 0) {
                filtered = filtered.filter(f =>
                    (f.title || '').toLowerCase().includes(searchText) ||
                    (f.content || '').toLowerCase().includes(searchText)
                );
            }

            // Apply filters
            if (sentiment) {
                filtered = filtered.filter(f => f.sentiment_label === sentiment);
            }
            if (category) {
                filtered = filtered.filter(f => f.category === category);
            }
            if (priority) {
                filtered = filtered.filter(f => f.priority === priority);
            }

            // Sort
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            switch (sortBy) {
                case 'newest':
                    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                case 'oldest':
                    filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    break;
                case 'sentiment-high':
                    filtered.sort((a, b) => (b.sentiment_score || 0) - (a.sentiment_score || 0));
                    break;
                case 'sentiment-low':
                    filtered.sort((a, b) => (a.sentiment_score || 0) - (b.sentiment_score || 0));
                    break;
                case 'priority':
                    filtered.sort((a, b) => (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3));
                    break;
            }

            displayFeedback(filtered);
        }

        function clearFilters() {
            document.getElementById('search-input').value = '';
            document.getElementById('filter-sentiment').value = '';
            document.getElementById('filter-category').value = '';
            document.getElementById('filter-priority').value = '';
            document.getElementById('sort-by').value = 'newest';

            if (currentProductId) {
                loadFeedback(currentProductId, currentProductName);
            }
        }

        function displayFeedback(feedback) {
            const container = document.getElementById('feedback-list');

            if (!feedback || feedback.length === 0) {
                container.innerHTML = \`
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <div>No feedback found</div>
                        <div style="margin-top: 10px; font-size: 13px;">Try adjusting your filters or loading mock data</div>
                    </div>
                \`;
                return;
            }

            container.innerHTML = '';
            feedback.forEach(item => {
                const div = document.createElement('div');
                div.className = \`feedback-item \${item.sentiment_label || 'neutral'}\`;
                div.onclick = () => openModal(item);

                const priorityClass = 'badge-priority-' + (item.priority || 'medium');

                div.innerHTML = \`
                    <div class="feedback-item-header">
                        <div class="feedback-title">\${item.title || 'Untitled Feedback'}</div>
                        <div class="feedback-badges">
                            \${item.sentiment_label ? \`<span class="badge badge-\${item.sentiment_label}">\${item.sentiment_label}</span>\` : ''}
                            \${item.category ? \`<span class="badge badge-category">\${item.category.replace('_', ' ')}</span>\` : ''}
                            \${item.priority ? \`<span class="badge \${priorityClass}">\${item.priority}</span>\` : ''}
                        </div>
                    </div>
                    <div class="feedback-preview">\${(item.content || '').substring(0, 150)}\${(item.content || '').length > 150 ? '...' : ''}</div>
                    <div class="feedback-meta">
                        \${item.author_name || 'Anonymous'} • \${formatDate(item.created_at)}
                        \${item.similarity_score ? \` • <strong>\${(item.similarity_score * 100).toFixed(0)}% match</strong>\` : ''}
                    </div>
                \`;

                container.appendChild(div);
            });
        }

        function formatDate(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        function openModal(item) {
            document.getElementById('modal-title').textContent = item.title || 'Feedback Details';
            document.getElementById('modal-content').textContent = item.content || '';

            const priorityClass = 'badge-priority-' + (item.priority || 'medium');
            document.getElementById('modal-badges').innerHTML = \`
                \${item.sentiment_label ? \`<span class="badge badge-\${item.sentiment_label}">\${item.sentiment_label}</span>\` : ''}
                \${item.category ? \`<span class="badge badge-category">\${item.category.replace('_', ' ')}</span>\` : ''}
                \${item.priority ? \`<span class="badge \${priorityClass}">\${item.priority}</span>\` : ''}
            \`;

            document.getElementById('modal-details').innerHTML = \`
                <div class="detail-item">
                    <span class="detail-label">Author</span>
                    <span class="detail-value">\${item.author_name || 'Anonymous'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">\${item.author_email || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Source</span>
                    <span class="detail-value">\${item.source_id ? 'Source #' + item.source_id : '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Sentiment Score</span>
                    <span class="detail-value">\${item.sentiment_score !== null ? item.sentiment_score.toFixed(2) : '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Created</span>
                    <span class="detail-value">\${formatDate(item.created_at)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Processed</span>
                    <span class="detail-value">\${formatDate(item.processed_at)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status</span>
                    <span class="detail-value">\${item.status || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">ID</span>
                    <span class="detail-value">#\${item.id}</span>
                </div>
            \`;

            document.getElementById('modal-overlay').classList.add('active');
        }

        function closeModal(event) {
            if (!event || event.target.id === 'modal-overlay') {
                document.getElementById('modal-overlay').classList.remove('active');
            }
        }

        // Close modal on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        // Load products on page load
        loadProducts();
    </script>
</body>
</html>`;
