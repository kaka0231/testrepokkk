/**
 * PulseIQ — Analytics Dashboard Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // Mock Datasets & State Management
  // ==========================================================================

  const state = {
    theme: localStorage.getItem('pulseiq_theme') || 'dark',
    range: '30d',
    chartInterval: 'day',
    tableSearch: '',
    tableStatusFilter: 'all',
    tableSortKey: 'date',
    tableSortDir: 'desc',
    currentPage: 1,
    rowsPerPage: 6,
    hoveredChartIndex: null,
  };

  // KPI Datasets by Time Range
  const kpiData = {
    '7d': {
      revenue: '$32,840',
      revenueTrend: '+18.4%',
      revenueDiff: '+$5,120 from last 7 days',
      users: '8,420',
      usersTrend: '+12.1%',
      usersDiff: '+920 active accounts',
      aov: '$148.20',
      aovTrend: '+4.5%',
      aovDiff: 'Higher tier adoption',
      conv: '4.12%',
      convTrend: '+0.6%',
      convDiff: 'Campaign target beat',
      periodLabel: 'Last 7 Days',
      sparklines: {
        revenue: [24, 28, 26, 35, 38, 34, 42],
        users: [12, 14, 15, 18, 17, 21, 24],
        aov: [130, 134, 138, 136, 142, 145, 148],
        conv: [3.4, 3.6, 3.5, 3.8, 3.9, 4.0, 4.12],
      }
    },
    '30d': {
      revenue: '$128,430',
      revenueTrend: '+14.2%',
      revenueDiff: '+$15,920 from previous period',
      users: '24,892',
      usersTrend: '+8.7%',
      usersDiff: '+1,980 new org accounts',
      aov: '$142.80',
      aovTrend: '+3.2%',
      aovDiff: 'Expansion revenue up 18%',
      conv: '3.84%',
      convTrend: '-0.4%',
      convDiff: 'Target benchmark: 3.50%',
      periodLabel: 'Last 30 Days',
      sparklines: {
        revenue: [18, 22, 25, 24, 30, 28, 35, 32, 40, 38, 44, 48],
        users: [10, 12, 14, 15, 16, 18, 19, 21, 22, 23, 24, 25],
        aov: [120, 125, 128, 132, 130, 135, 138, 140, 141, 142, 142, 143],
        conv: [4.2, 4.0, 3.9, 3.8, 3.9, 3.7, 3.8, 3.9, 3.85, 3.8, 3.82, 3.84],
      }
    },
    '90d': {
      revenue: '$412,890',
      revenueTrend: '+22.6%',
      revenueDiff: '+$76,400 from previous quarter',
      users: '58,340',
      usersTrend: '+16.4%',
      usersDiff: '+8,200 enterprise seats',
      aov: '$139.50',
      aovTrend: '+5.8%',
      aovDiff: 'Multi-seat bundles launched',
      conv: '3.91%',
      convTrend: '+1.2%',
      convDiff: 'Steady quarter-over-quarter',
      periodLabel: 'Last 90 Days',
      sparklines: {
        revenue: [14, 18, 22, 28, 31, 35, 38, 42, 45, 52, 58, 64],
        users: [8, 12, 16, 20, 26, 32, 38, 44, 49, 52, 55, 58],
        aov: [115, 118, 122, 125, 128, 130, 132, 135, 136, 138, 138, 140],
        conv: [3.2, 3.4, 3.5, 3.6, 3.7, 3.8, 3.8, 3.85, 3.88, 3.9, 3.9, 3.91],
      }
    },
    '1y': {
      revenue: '$1,824,500',
      revenueTrend: '+48.3%',
      revenueDiff: '+$594,000 year-over-year ARR',
      users: '142,800',
      usersTrend: '+34.0%',
      usersDiff: '+36,400 new accounts',
      aov: '$136.20',
      aovTrend: '+9.4%',
      aovDiff: 'Enterprise pipeline expanded',
      conv: '3.78%',
      convTrend: '+0.8%',
      convDiff: 'Annualized stability index',
      periodLabel: 'Past 12 Months',
      sparklines: {
        revenue: [10, 14, 18, 25, 29, 35, 42, 50, 60, 72, 85, 100],
        users: [6, 10, 15, 22, 30, 42, 55, 70, 88, 105, 124, 143],
        aov: [105, 110, 115, 118, 122, 125, 128, 130, 132, 134, 135, 136],
        conv: [3.0, 3.1, 3.3, 3.4, 3.5, 3.6, 3.65, 3.7, 3.72, 3.74, 3.76, 3.78],
      }
    }
  };

  // Trajectory Chart Series per interval
  const chartDatasets = {
    day: [
      { label: 'Sep 1', val: 3200, orders: 22 },
      { label: 'Sep 4', val: 4100, orders: 29 },
      { label: 'Sep 7', val: 3600, orders: 25 },
      { label: 'Sep 10', val: 5200, orders: 36 },
      { label: 'Sep 13', val: 4800, orders: 31 },
      { label: 'Sep 16', val: 6100, orders: 42 },
      { label: 'Sep 19', val: 5400, orders: 38 },
      { label: 'Sep 22', val: 6900, orders: 48 },
      { label: 'Sep 24', val: 7850, orders: 54 },
    ],
    week: [
      { label: 'W1 Aug', val: 18400, orders: 130 },
      { label: 'W2 Aug', val: 21900, orders: 154 },
      { label: 'W3 Aug', val: 24200, orders: 172 },
      { label: 'W4 Aug', val: 22800, orders: 160 },
      { label: 'W1 Sep', val: 27500, orders: 195 },
      { label: 'W2 Sep', val: 31200, orders: 218 },
      { label: 'W3 Sep', val: 29800, orders: 204 },
      { label: 'W4 Sep', val: 35600, orders: 248 },
    ],
    month: [
      { label: 'Jan', val: 84000, orders: 590 },
      { label: 'Feb', val: 92000, orders: 645 },
      { label: 'Mar', val: 104000, orders: 720 },
      { label: 'Apr', val: 99000, orders: 690 },
      { label: 'May', val: 115000, orders: 810 },
      { label: 'Jun', val: 122000, orders: 855 },
      { label: 'Jul', val: 118000, orders: 825 },
      { label: 'Aug', val: 134000, orders: 940 },
      { label: 'Sep', val: 148000, orders: 1030 },
    ]
  };

  // Traffic Distribution Data
  const trafficChannels = [
    { name: 'Organic Search', pct: 42, color: '#8b5cf6', visits: '68,240' },
    { name: 'Direct Traffic', pct: 28, color: '#3b82f6', visits: '45,490' },
    { name: 'Social & Referral', pct: 18, color: '#06b6d4', visits: '29,250' },
    { name: 'Email & Affiliates', pct: 12, color: '#10b981', visits: '19,520' },
  ];

  // Transactions Mock Database
  let transactions = [
    {
      id: 'TX-9842',
      customer: 'Acme Corporation',
      email: 'finance@acme.com',
      avatar: 'AC',
      plan: 'Enterprise Platform',
      date: '2026-09-24 14:28',
      status: 'completed',
      amount: 2400.00,
      rail: 'Stripe Credit Card'
    },
    {
      id: 'TX-9841',
      customer: 'Linear Technologies',
      email: 'billing@linear.app',
      avatar: 'LT',
      plan: 'Pro Team Cloud',
      date: '2026-09-24 12:15',
      status: 'completed',
      amount: 580.00,
      rail: 'ACH Wire Transfer'
    },
    {
      id: 'TX-9840',
      customer: 'Vercel Deployment Labs',
      email: 'ops@vercel.com',
      avatar: 'VD',
      plan: 'Enterprise Platform',
      date: '2026-09-24 09:40',
      status: 'completed',
      amount: 2400.00,
      rail: 'Stripe Credit Card'
    },
    {
      id: 'TX-9839',
      customer: 'Supabase Data Co.',
      email: 'admin@supabase.io',
      avatar: 'SD',
      plan: 'Growth Starter',
      date: '2026-09-23 20:11',
      status: 'pending',
      amount: 199.00,
      rail: 'Apple Pay'
    },
    {
      id: 'TX-9838',
      customer: 'Retool Custom Apps',
      email: 'accounts@retool.com',
      avatar: 'RC',
      plan: 'Pro Team Cloud',
      date: '2026-09-23 16:55',
      status: 'completed',
      amount: 580.00,
      rail: 'ACH Wire Transfer'
    },
    {
      id: 'TX-9837',
      customer: 'Stripe Payments Inc',
      email: 'integrations@stripe.com',
      avatar: 'SP',
      plan: 'Enterprise Platform',
      date: '2026-09-23 11:04',
      status: 'completed',
      amount: 3600.00,
      rail: 'ACH Wire Transfer'
    },
    {
      id: 'TX-9836',
      customer: 'Nordic Peak Design',
      email: 'hello@nordicpeak.se',
      avatar: 'NP',
      plan: 'Growth Starter',
      date: '2026-09-22 18:22',
      status: 'refunded',
      amount: 199.00,
      rail: 'Stripe Credit Card'
    },
    {
      id: 'TX-9835',
      customer: 'Cloudflare Network',
      email: 'noc@cloudflare.com',
      avatar: 'CN',
      plan: 'API Compute Add-on',
      date: '2026-09-22 14:18',
      status: 'completed',
      amount: 120.00,
      rail: 'Stripe Credit Card'
    },
    {
      id: 'TX-9834',
      customer: 'Datadog Monitors',
      email: 'telemetry@datadoghq.com',
      avatar: 'DM',
      plan: 'Enterprise Platform',
      date: '2026-09-21 17:30',
      status: 'completed',
      amount: 2400.00,
      rail: 'Stripe Credit Card'
    },
    {
      id: 'TX-9833',
      customer: 'Figma Community Guild',
      email: 'partners@figma.com',
      avatar: 'FC',
      plan: 'Pro Team Cloud',
      date: '2026-09-21 10:05',
      status: 'pending',
      amount: 580.00,
      rail: 'Stripe Credit Card'
    },
    {
      id: 'TX-9832',
      customer: 'Snowflake Analytics',
      email: 'warehouse@snowflake.net',
      avatar: 'SA',
      plan: 'Enterprise Platform',
      date: '2026-09-20 15:45',
      status: 'completed',
      amount: 4800.00,
      rail: 'ACH Wire Transfer'
    },
    {
      id: 'TX-9831',
      customer: 'Shopify Merchant Care',
      email: 'billing@shopify.com',
      avatar: 'SM',
      plan: 'API Compute Add-on',
      date: '2026-09-20 08:12',
      status: 'completed',
      amount: 240.00,
      rail: 'Stripe Credit Card'
    },
    {
      id: 'TX-9830',
      customer: 'Prisma ORM Cloud',
      email: 'devs@prisma.io',
      avatar: 'PO',
      plan: 'Growth Starter',
      date: '2026-09-19 13:40',
      status: 'completed',
      amount: 199.00,
      rail: 'Apple Pay'
    },
    {
      id: 'TX-9829',
      customer: 'Tailwind Labs',
      email: 'support@tailwindcss.com',
      avatar: 'TL',
      plan: 'Pro Team Cloud',
      date: '2026-09-18 19:22',
      status: 'refunded',
      amount: 580.00,
      rail: 'Stripe Credit Card'
    }
  ];

  // ==========================================================================
  // DOM Elements Selection
  // ==========================================================================

  const htmlRoot = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const sidebar = document.getElementById('sidebar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const notifBellBtn = document.getElementById('notifBellBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const notifBadge = document.getElementById('notifBadge');
  const clearNotifsBtn = document.getElementById('clearNotifsBtn');
  const dismissBannerBtn = document.getElementById('dismissBannerBtn');
  const globalSearchInput = document.getElementById('globalSearchInput');
  const rangeButtons = document.querySelectorAll('.range-btn');
  const chartIntervalButtons = document.querySelectorAll('#chartIntervalSelector .pill-btn');
  const simulateDataBtn = document.getElementById('simulateDataBtn');
  const upgradeBtn = document.getElementById('upgradeBtn');
  const toastContainer = document.getElementById('toastContainer');

  // Chart Elements
  const revenueChartSvg = document.getElementById('revenueChartSvg');
  const chartGridLines = document.getElementById('chartGridLines');
  const chartAreaPath = document.getElementById('chartAreaPath');
  const chartLinePath = document.getElementById('chartLinePath');
  const chartCrosshair = document.getElementById('chartCrosshair');
  const chartActivePoint = document.getElementById('chartActivePoint');
  const chartAxisLabels = document.getElementById('chartAxisLabels');
  const chartTooltip = document.getElementById('chartTooltip');
  const tooltipDate = document.getElementById('tooltipDate');
  const tooltipRevenue = document.getElementById('tooltipRevenue');
  const tooltipTx = document.getElementById('tooltipTx');
  const donutSvg = document.getElementById('donutSvg');
  const donutLegend = document.getElementById('donutLegend');

  // Table Elements
  const transactionsTableBody = document.getElementById('transactionsTableBody');
  const tableFilterInput = document.getElementById('tableFilterInput');
  const statusFilterTabs = document.querySelectorAll('#statusFilterTabs .filter-tab');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const pageNumbers = document.getElementById('pageNumbers');
  const showingStart = document.getElementById('showingStart');
  const showingEnd = document.getElementById('showingEnd');
  const showingTotal = document.getElementById('showingTotal');
  const navTxCount = document.getElementById('navTxCount');

  // Modal Elements
  const openAddTxModalBtn = document.getElementById('openAddTxModalBtn');
  const txModalBackdrop = document.getElementById('txModalBackdrop');
  const closeTxModalBtn = document.getElementById('closeTxModalBtn');
  const cancelTxBtn = document.getElementById('cancelTxBtn');
  const newTxForm = document.getElementById('newTxForm');

  // ==========================================================================
  // Theme Management
  // ==========================================================================

  function applyTheme(theme) {
    state.theme = theme;
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('pulseiq_theme', theme);
    // Redraw charts with theme-appropriate colors
    renderRevenueChart();
  }

  applyTheme(state.theme);

  themeToggleBtn.addEventListener('click', () => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} theme`, 'info');
  });

  // ==========================================================================
  // Mobile Sidebar & Navigation
  // ==========================================================================

  function toggleMobileSidebar(open) {
    if (open) {
      sidebar.classList.add('mobile-open');
      sidebarBackdrop.classList.add('active');
    } else {
      sidebar.classList.remove('mobile-open');
      sidebarBackdrop.classList.remove('active');
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileSidebar(true));
  }
  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', () => toggleMobileSidebar(false));
  }
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => toggleMobileSidebar(false));
  }

  // Sidebar links active state toggle
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      document.querySelectorAll('.sidebar-nav .nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      toggleMobileSidebar(false);
      const tabName = link.dataset.tab;
      showToast(`Navigated to ${link.querySelector('span').textContent}`, 'info');
    });
  });

  // Upgrade Plan CTA button
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
      showToast('Opening Enterprise Scale configurator...', 'info');
    });
  }

  // Banner Notice dismiss
  if (dismissBannerBtn) {
    dismissBannerBtn.addEventListener('click', () => {
      dismissBannerBtn.closest('.banner-notice').style.display = 'none';
    });
  }

  // ==========================================================================
  // Notifications Popover
  // ==========================================================================

  if (notifBellBtn) {
    notifBellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('active');
    });
  }

  document.addEventListener('click', (e) => {
    if (notifDropdown && notifDropdown.classList.contains('active') && !notifDropdown.contains(e.target) && e.target !== notifBellBtn) {
      notifDropdown.classList.remove('active');
    }
  });

  if (clearNotifsBtn) {
    clearNotifsBtn.addEventListener('click', () => {
      document.querySelectorAll('.notif-item').forEach(item => {
        item.classList.remove('unread');
      });
      if (notifBadge) notifBadge.style.display = 'none';
      showToast('All notifications marked as read', 'info');
    });
  }

  // ==========================================================================
  // KPI Metrics & Sparklines
  // ==========================================================================

  function renderSparkline(containerId, dataPoints, strokeColor) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const min = Math.min(...dataPoints);
    const max = Math.max(...dataPoints);
    const range = (max - min) || 1;
    const width = 180;
    const height = 36;
    const padding = 4;

    const points = dataPoints.map((val, idx) => {
      const x = (idx / (dataPoints.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkGrad-${containerId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.3" />
            <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        <path d="${areaD}" fill="url(#sparkGrad-${containerId})" />
        <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  function updateKPIs(rangeKey) {
    const data = kpiData[rangeKey] || kpiData['30d'];

    // Update text values
    document.getElementById('kpiRevenueVal').textContent = data.revenue;
    document.getElementById('kpiRevenueTrend').querySelector('span').textContent = data.revenueTrend;
    document.getElementById('kpiRevenue').querySelector('.kpi-subtext').textContent = data.revenueDiff;

    document.getElementById('kpiUsersVal').textContent = data.users;
    document.getElementById('kpiUsersTrend').querySelector('span').textContent = data.usersTrend;
    document.getElementById('kpiUsers').querySelector('.kpi-subtext').textContent = data.usersDiff;

    document.getElementById('kpiAovVal').textContent = data.aov;
    document.getElementById('kpiAovTrend').querySelector('span').textContent = data.aovTrend;
    document.getElementById('kpiAov').querySelector('.kpi-subtext').textContent = data.aovDiff;

    document.getElementById('kpiConversionVal').textContent = data.conv;
    document.getElementById('kpiConversionTrend').querySelector('span').textContent = data.convTrend;
    document.getElementById('kpiConversion').querySelector('.kpi-subtext').textContent = data.convDiff;

    document.getElementById('kpiPeriodLabel').textContent = data.periodLabel;

    // Render Sparklines
    renderSparkline('sparklineRevenue', data.sparklines.revenue, '#8b5cf6');
    renderSparkline('sparklineUsers', data.sparklines.users, '#3b82f6');
    renderSparkline('sparklineAov', data.sparklines.aov, '#10b981');
    renderSparkline('sparklineConversion', data.sparklines.conv, '#f59e0b');
  }

  // Range Selector Buttons
  rangeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      rangeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const range = btn.dataset.range;
      state.range = range;
      updateKPIs(range);
      showToast(`Telemetry range updated to ${btn.textContent}`, 'info');
    });
  });

  // Chart Interval Buttons (Daily, Weekly, Monthly)
  chartIntervalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      chartIntervalButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.chartInterval = btn.dataset.interval;
      renderRevenueChart();
    });
  });

  // ==========================================================================
  // Interactive Revenue Spline Chart
  // ==========================================================================

  function getSvgPathWithBezier(points) {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }

  let currentPoints = [];

  function renderRevenueChart() {
    const dataset = chartDatasets[state.chartInterval] || chartDatasets.day;
    const svgWidth = 800;
    const svgHeight = 320;
    const padLeft = 40;
    const padRight = 30;
    const padTop = 30;
    const padBottom = 50;

    const plotWidth = svgWidth - padLeft - padRight;
    const plotHeight = svgHeight - padTop - padBottom;

    const values = dataset.map(d => d.val);
    const minVal = 0;
    const maxVal = Math.ceil(Math.max(...values) * 1.18 / 1000) * 1000;

    // Draw horizontal grid lines & Y labels
    const gridRows = 4;
    let gridHtml = '';
    for (let i = 0; i <= gridRows; i++) {
      const y = padTop + (plotHeight / gridRows) * i;
      const labelVal = Math.round(maxVal - (maxVal / gridRows) * i);
      const formattedLabel = labelVal >= 1000 ? `$${(labelVal / 1000).toFixed(0)}k` : `$${labelVal}`;

      gridHtml += `<line x1="${padLeft}" y1="${y}" x2="${svgWidth - padRight}" y2="${y}" />`;
      gridHtml += `<text x="${padLeft - 8}" y="${y + 4}" text-anchor="end" fill="var(--text-muted)" font-size="10">${formattedLabel}</text>`;
    }
    chartGridLines.innerHTML = gridHtml;

    // Calculate Coordinates for Points
    currentPoints = dataset.map((item, idx) => {
      const x = padLeft + (idx / (dataset.length - 1)) * plotWidth;
      const y = padTop + plotHeight - ((item.val - minVal) / (maxVal - minVal)) * plotHeight;
      return { x, y, data: item };
    });

    // Spline Line Path & Area Path
    const linePathD = getSvgPathWithBezier(currentPoints);
    const firstPt = currentPoints[0];
    const lastPt = currentPoints[currentPoints.length - 1];
    const areaPathD = `${linePathD} L ${lastPt.x} ${padTop + plotHeight} L ${firstPt.x} ${padTop + plotHeight} Z`;

    chartLinePath.setAttribute('d', linePathD);
    chartAreaPath.setAttribute('d', areaPathD);

    // X Axis Labels
    let axisHtml = '';
    currentPoints.forEach(pt => {
      axisHtml += `<text x="${pt.x}" y="${svgHeight - 16}" text-anchor="middle">${pt.data.label}</text>`;
    });
    chartAxisLabels.innerHTML = axisHtml;
  }

  // Interactive crosshair & tooltip tracking
  if (revenueChartSvg) {
    revenueChartSvg.addEventListener('mousemove', (e) => {
      if (!currentPoints.length) return;
      const rect = revenueChartSvg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const scaleX = 800 / rect.width;
      const svgMouseX = mouseX * scaleX;

      // Find closest point
      let closest = currentPoints[0];
      let minDiff = Math.abs(svgMouseX - closest.x);

      currentPoints.forEach(pt => {
        const diff = Math.abs(svgMouseX - pt.x);
        if (diff < minDiff) {
          minDiff = diff;
          closest = pt;
        }
      });

      // Update crosshair & point
      chartCrosshair.setAttribute('x1', closest.x);
      chartCrosshair.setAttribute('x2', closest.x);
      chartCrosshair.setAttribute('y1', 30);
      chartCrosshair.setAttribute('y2', 270);
      chartCrosshair.setAttribute('opacity', '1');

      chartActivePoint.setAttribute('cx', closest.x);
      chartActivePoint.setAttribute('cy', closest.y);
      chartActivePoint.setAttribute('opacity', '1');

      // Update tooltip
      tooltipDate.textContent = closest.data.label + (state.chartInterval === 'day' ? ', 2026' : '');
      tooltipRevenue.textContent = `$${closest.data.val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      tooltipTx.textContent = `${closest.data.orders} transactions`;

      // Position tooltip relative to container in CSS pixels
      const containerRect = document.getElementById('revenueChartContainer').getBoundingClientRect();
      const ptPixelX = (closest.x / 800) * containerRect.width;
      const ptPixelY = (closest.y / 320) * containerRect.height;

      chartTooltip.style.left = `${ptPixelX}px`;
      chartTooltip.style.top = `${ptPixelY}px`;
      chartTooltip.classList.add('visible');
    });

    revenueChartSvg.addEventListener('mouseleave', () => {
      chartCrosshair.setAttribute('opacity', '0');
      chartActivePoint.setAttribute('opacity', '0');
      chartTooltip.classList.remove('visible');
    });
  }

  // Simulate Pulse event button
  if (simulateDataBtn) {
    simulateDataBtn.addEventListener('click', () => {
      // Simulate live incoming payment
      const currentList = chartDatasets[state.chartInterval];
      const last = currentList[currentList.length - 1];
      const delta = Math.floor(Math.random() * 800) + 400;
      last.val += delta;
      last.orders += 2;

      renderRevenueChart();

      // Bump gross revenue
      const revEl = document.getElementById('kpiRevenueVal');
      const currentRevNum = parseInt(revEl.textContent.replace(/[^0-9]/g, ''), 10) || 128430;
      revEl.textContent = `$${(currentRevNum + delta).toLocaleString()}`;

      showToast(`Telemetry pulse: +$${delta} simulated sale captured!`, 'success');
    });
  }

  // ==========================================================================
  // Traffic Distribution Donut Chart
  // ==========================================================================

  function renderTrafficDonut() {
    if (!donutSvg || !donutLegend) return;

    const size = 200;
    const center = size / 2;
    const radius = 68;
    const circumference = 2 * Math.PI * radius;

    let accumulatedPct = 0;
    let svgHtml = '';
    let legendHtml = '';

    trafficChannels.forEach((ch, idx) => {
      const strokeDash = (ch.pct / 100) * circumference;
      const strokeOffset = circumference - (accumulatedPct / 100) * circumference;

      svgHtml += `
        <circle
          class="donut-segment"
          data-index="${idx}"
          cx="${center}"
          cy="${center}"
          r="${radius}"
          stroke="${ch.color}"
          stroke-dasharray="${strokeDash} ${circumference - strokeDash}"
          stroke-dashoffset="${strokeOffset}"
        />
      `;

      legendHtml += `
        <div class="donut-legend-row" data-index="${idx}">
          <div class="donut-legend-left">
            <span class="donut-legend-dot" style="background-color: ${ch.color}"></span>
            <span>${ch.name}</span>
          </div>
          <div class="donut-legend-pct">${ch.pct}% <span style="color: var(--text-muted); font-weight: normal; font-size: 0.72rem;">(${ch.visits})</span></div>
        </div>
      `;

      accumulatedPct += ch.pct;
    });

    donutSvg.innerHTML = svgHtml;
    donutLegend.innerHTML = legendHtml;

    // Hover interactions for donut
    const segments = donutSvg.querySelectorAll('.donut-segment');
    const legendRows = donutLegend.querySelectorAll('.donut-legend-row');

    function highlightChannel(index) {
      const ch = trafficChannels[index];
      if (!ch) return;
      document.getElementById('donutTotalVal').textContent = `${ch.pct}%`;
      document.getElementById('donutTotalVal').style.color = ch.color;
      document.querySelector('.donut-center-lbl').textContent = ch.name;
    }

    function resetChannel() {
      document.getElementById('donutTotalVal').textContent = '100%';
      document.getElementById('donutTotalVal').style.color = '';
      document.querySelector('.donut-center-lbl').textContent = 'Share';
    }

    segments.forEach(seg => {
      seg.addEventListener('mouseenter', () => highlightChannel(parseInt(seg.dataset.index, 10)));
      seg.addEventListener('mouseleave', resetChannel);
    });

    legendRows.forEach(row => {
      row.addEventListener('mouseenter', () => highlightChannel(parseInt(row.dataset.index, 10)));
      row.addEventListener('mouseleave', resetChannel);
    });
  }

  // ==========================================================================
  // Data Table: Filtering, Sorting, Pagination
  // ==========================================================================

  function getFilteredTransactions() {
    let list = [...transactions];

    // Status filter
    if (state.tableStatusFilter !== 'all') {
      list = list.filter(tx => tx.status.toLowerCase() === state.tableStatusFilter.toLowerCase());
    }

    // Text search
    if (state.tableSearch.trim()) {
      const q = state.tableSearch.toLowerCase().trim();
      list = list.filter(tx =>
        tx.id.toLowerCase().includes(q) ||
        tx.customer.toLowerCase().includes(q) ||
        tx.email.toLowerCase().includes(q) ||
        tx.plan.toLowerCase().includes(q) ||
        tx.status.toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      let valA = a[state.tableSortKey];
      let valB = b[state.tableSortKey];

      if (state.tableSortKey === 'amount') {
        valA = Number(valA);
        valB = Number(valB);
      } else if (state.tableSortKey === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return state.tableSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return state.tableSortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }

  function renderTable() {
    const filtered = getFilteredTransactions();
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / state.rowsPerPage));

    if (state.currentPage > totalPages) state.currentPage = totalPages;

    const startIdx = (state.currentPage - 1) * state.rowsPerPage;
    const pageItems = filtered.slice(startIdx, startIdx + state.rowsPerPage);

    // Update table body
    if (pageItems.length === 0) {
      transactionsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
            No transactions found matching your criteria.
          </td>
        </tr>
      `;
    } else {
      transactionsTableBody.innerHTML = pageItems.map(tx => `
        <tr>
          <td class="tx-id">${tx.id}</td>
          <td>
            <div class="customer-cell">
              <div class="customer-avatar">${tx.avatar}</div>
              <div>
                <span class="customer-name">${tx.customer}</span>
                <span class="customer-email">${tx.email}</span>
              </div>
            </div>
          </td>
          <td><span class="plan-badge">${tx.plan}</span></td>
          <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.78rem;">${tx.date}</td>
          <td>
            <span class="tx-status-badge ${tx.status}">
              <span class="status-dot"></span>
              ${tx.status}
            </span>
          </td>
          <td class="tx-amount text-right">$${tx.amount.toFixed(2)}</td>
          <td class="text-center">
            <button class="table-row-action" title="View Details" onclick="window.viewTxDetail('${tx.id}')">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Update Counts & Pagination
    showingStart.textContent = totalItems === 0 ? 0 : startIdx + 1;
    showingEnd.textContent = Math.min(startIdx + state.rowsPerPage, totalItems);
    showingTotal.textContent = totalItems;
    if (navTxCount) navTxCount.textContent = transactions.length;

    prevPageBtn.disabled = state.currentPage <= 1;
    nextPageBtn.disabled = state.currentPage >= totalPages;

    // Render Page Number Buttons
    let pageBtnHtml = '';
    for (let p = 1; p <= totalPages; p++) {
      pageBtnHtml += `<button class="page-num ${p === state.currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
    pageNumbers.innerHTML = pageBtnHtml;

    pageNumbers.querySelectorAll('.page-num').forEach(btn => {
      btn.addEventListener('click', () => {
        state.currentPage = parseInt(btn.dataset.page, 10);
        renderTable();
      });
    });
  }

  // Row Action Global Handler
  window.viewTxDetail = function(id) {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      showToast(`Selected ${tx.id}: $${tx.amount.toFixed(2)} paid via ${tx.rail}`, 'info');
    }
  };

  // Table Search Filter
  if (tableFilterInput) {
    tableFilterInput.addEventListener('input', (e) => {
      state.tableSearch = e.target.value;
      state.currentPage = 1;
      renderTable();
    });
  }

  // Global Header Search shortcut
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      state.tableSearch = e.target.value;
      if (tableFilterInput) tableFilterInput.value = e.target.value;
      state.currentPage = 1;
      renderTable();
      // Scroll to table smoothly if typed
      if (e.target.value.length > 2) {
        document.getElementById('transactionsSection')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Status Filter Tabs
  statusFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      statusFilterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.tableStatusFilter = tab.dataset.status;
      state.currentPage = 1;
      renderTable();
    });
  });

  // Table Header Sorting
  document.querySelectorAll('.data-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const sortKey = th.dataset.sort;
      if (state.tableSortKey === sortKey) {
        state.tableSortDir = state.tableSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.tableSortKey = sortKey;
        state.tableSortDir = 'desc';
      }
      renderTable();
    });
  });

  // Table Pagination Navigation
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        renderTable();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      const filtered = getFilteredTransactions();
      const totalPages = Math.ceil(filtered.length / state.rowsPerPage);
      if (state.currentPage < totalPages) {
        state.currentPage++;
        renderTable();
      }
    });
  }

  // Export CSV Action
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const dataToExport = getFilteredTransactions();
      if (!dataToExport.length) {
        showToast('No transactions available to export.', 'info');
        return;
      }

      const headers = ['Transaction ID', 'Customer', 'Email', 'Product', 'Date', 'Status', 'Amount', 'Payment Method'];
      const rows = dataToExport.map(tx => [
        tx.id,
        `"${tx.customer}"`,
        tx.email,
        `"${tx.plan}"`,
        tx.date,
        tx.status,
        tx.amount.toFixed(2),
        `"${tx.rail}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `pulseiq-transactions-${state.range}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Exported ${dataToExport.length} transactions as CSV file`, 'success');
    });
  }

  // ==========================================================================
  // New Transaction Modal & Creation
  // ==========================================================================

  function toggleModal(open) {
    if (open) {
      txModalBackdrop.classList.add('active');
      document.getElementById('txCustomerName').focus();
    } else {
      txModalBackdrop.classList.remove('active');
      newTxForm.reset();
    }
  }

  if (openAddTxModalBtn) {
    openAddTxModalBtn.addEventListener('click', () => toggleModal(true));
  }
  if (closeTxModalBtn) {
    closeTxModalBtn.addEventListener('click', () => toggleModal(false));
  }
  if (cancelTxBtn) {
    cancelTxBtn.addEventListener('click', () => toggleModal(false));
  }
  if (txModalBackdrop) {
    txModalBackdrop.addEventListener('click', (e) => {
      if (e.target === txModalBackdrop) toggleModal(false);
    });
  }

  // Record New Sale Submission
  if (newTxForm) {
    newTxForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const customer = document.getElementById('txCustomerName').value.trim();
      const email = document.getElementById('txCustomerEmail').value.trim();
      const plan = document.getElementById('txProduct').value;
      const amount = parseFloat(document.getElementById('txAmount').value);
      const status = document.getElementById('txStatus').value.toLowerCase();
      const rail = document.getElementById('txMethod').value;

      if (!customer || !email || isNaN(amount) || amount <= 0) {
        showToast('Please provide valid customer details and amount.', 'info');
        return;
      }

      // Generate Initials
      const words = customer.split(' ');
      const initials = words.length > 1
        ? (words[0][0] + words[1][0]).toUpperCase()
        : customer.slice(0, 2).toUpperCase();

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newTx = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        customer,
        email,
        avatar: initials,
        plan,
        date: dateStr,
        status,
        amount,
        rail
      };

      // Add to beginning of transactions
      transactions.unshift(newTx);
      state.currentPage = 1;
      renderTable();

      // Update Gross Revenue Card
      const revEl = document.getElementById('kpiRevenueVal');
      const currentRevNum = parseInt(revEl.textContent.replace(/[^0-9]/g, ''), 10) || 128430;
      revEl.textContent = `$${(currentRevNum + amount).toLocaleString()}`;

      toggleModal(false);
      showToast(`Sale recorded: $${amount.toFixed(2)} from ${customer}!`, 'success');
    });
  }

  // ==========================================================================
  // Keyboard Shortcuts & Toast Helper
  // ==========================================================================

  window.addEventListener('keydown', (e) => {
    // Focus search on '/'
    if (e.key === '/' && document.activeElement !== globalSearchInput && document.activeElement !== tableFilterInput) {
      e.preventDefault();
      globalSearchInput?.focus();
    }
    // Close modal on Escape
    if (e.key === 'Escape') {
      if (txModalBackdrop.classList.contains('active')) {
        toggleModal(false);
      }
      if (notifDropdown.classList.contains('active')) {
        notifDropdown.classList.remove('active');
      }
    }
  });

  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconSvg = type === 'success'
      ? `<svg viewBox="0 0 24 24" width="16" height="16" stroke="var(--accent-emerald)" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg viewBox="0 0 24 24" width="16" height="16" stroke="var(--accent-purple)" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

    toast.innerHTML = `
      ${iconSvg}
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================================================
  // Initial Boot
  // ==========================================================================

  updateKPIs(state.range);
  renderRevenueChart();
  renderTrafficDonut();
  renderTable();

  // Responsive chart resize listener
  window.addEventListener('resize', () => {
    renderRevenueChart();
  });
});
