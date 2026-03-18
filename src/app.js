/* ============================================
   SENIOR GUARDIAN — Application Router & Views
   ============================================ */

(function () {
  'use strict';

  // ── State ──
  let currentRoute = 'dashboard';

  // ── DOM References ──
  const mainContent   = document.getElementById('mainContent');
  const sidebar       = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const menuToggle    = document.getElementById('menuToggle');
  const notificationBtn = document.getElementById('notificationBtn');
  const headerTitle   = document.getElementById('headerTitle');
  const headerSubtitle = document.getElementById('headerSubtitle');

  // ── Greeting based on time ──
  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }
  headerTitle.textContent = `${getGreeting()}, Marcelo`;

  // ── Mobile Menu ──
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  });

  // ── Notification Button ──
  notificationBtn.addEventListener('click', () => {
    navigateTo('alertas');
  });

  // ── Navigation ──
  document.querySelectorAll('[data-route]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = link.getAttribute('data-route');
      if (route) navigateTo(route);
    });
  });

  function navigateTo(route) {
    currentRoute = route;

    // Update sidebar active state
    document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('sidebar__link--active'));
    const activeLink = document.querySelector(`[data-route="${route}"]`);
    if (activeLink && activeLink.classList.contains('sidebar__link')) {
      activeLink.classList.add('sidebar__link--active');
    }

    // Close mobile sidebar
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');

    // Update header subtitle
    const subtitles = {
      dashboard: 'Seu Roberto está protegido. Tudo sob controle.',
      alertas: 'Acompanhe os eventos de segurança em tempo real.',
      relatorios: 'Visão consolidada da proteção mensal.',
      configuracoes: 'Ajuste o nível de proteção e preferências.'
    };
    headerSubtitle.textContent = subtitles[route] || '';

    // Render view
    renderView(route);
  }

  function renderView(route) {
    const views = { dashboard: dashboardView, alertas: alertasView, relatorios: relatoriosView, configuracoes: configuracoesView };
    const viewFn = views[route] || dashboardView;
    mainContent.innerHTML = viewFn();

    // Post-render hooks
    if (route === 'dashboard') initDashboardAnimations();
    if (route === 'configuracoes') initConfigInteractions();
    if (route === 'alertas') initAlertFilters();
  }

  // ============================================
  //  VIEW: Dashboard
  // ============================================
  function dashboardView() {
    return `
      <div class="page-header">
        <h1>Dashboard de Segurança</h1>
        <p>Resumo geral da proteção do dispositivo pareado.</p>
      </div>

      <div class="dashboard-grid">

        <!-- Status Global -->
        <div class="dashboard-grid__status">
          <div class="status-card card">
            <div class="status-card__content">
              <div class="status-card__shield">🛡️</div>
              <div class="status-card__info">
                <div class="status-card__label">Status do Dispositivo</div>
                <div class="status-card__status">Protegido</div>
                <div class="status-card__detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Última verificação: há 2 minutos · Celular do Seu Roberto
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="dashboard-grid__metrics">
          <div class="metric-card card">
            <div class="metric-card__icon metric-card__icon--danger">🚫</div>
            <div class="metric-card__value" data-count="12">0</div>
            <div class="metric-card__label">Ameaças Bloqueadas</div>
            <div class="metric-card__trend metric-card__trend--down">↓ 18% vs. mês anterior</div>
          </div>

          <div class="metric-card card">
            <div class="metric-card__icon metric-card__icon--warning">☎️</div>
            <div class="metric-card__value" data-count="8">0</div>
            <div class="metric-card__label">Chamadas Suspeitas Recusadas</div>
            <div class="metric-card__trend metric-card__trend--down">↓ 25% vs. mês anterior</div>
          </div>

          <div class="metric-card card">
            <div class="metric-card__icon metric-card__icon--info">🔗</div>
            <div class="metric-card__value" data-count="4">0</div>
            <div class="metric-card__label">Links Maliciosos Interceptados</div>
            <div class="metric-card__trend metric-card__trend--up">↑ 10% vs. mês anterior</div>
          </div>

          <div class="metric-card card">
            <div class="metric-card__icon metric-card__icon--success">✅</div>
            <div class="metric-card__value" data-count="156">0</div>
            <div class="metric-card__label">Verificações Realizadas</div>
            <div class="metric-card__trend metric-card__trend--down">↓ Estável</div>
          </div>
        </div>

        <!-- Bottom: Chart + LGPD -->
        <div class="dashboard-grid__bottom">
          <div class="chart-card card">
            <div class="card__header">
              <span class="card__title">Ameaças Bloqueadas — Últimos 6 Meses</span>
            </div>
            <div class="chart-card__chart" id="threatChart">
              <div class="chart-bar-group">
                <div class="chart-bar chart-bar--primary" data-height="45" style="height: 0;">
                  <span class="chart-bar__tooltip">5</span>
                </div>
                <span class="chart-bar-label">Out</span>
              </div>
              <div class="chart-bar-group">
                <div class="chart-bar chart-bar--primary" data-height="72" style="height: 0;">
                  <span class="chart-bar__tooltip">8</span>
                </div>
                <span class="chart-bar-label">Nov</span>
              </div>
              <div class="chart-bar-group">
                <div class="chart-bar chart-bar--warning" data-height="108" style="height: 0;">
                  <span class="chart-bar__tooltip">12</span>
                </div>
                <span class="chart-bar-label">Dez</span>
              </div>
              <div class="chart-bar-group">
                <div class="chart-bar chart-bar--primary" data-height="63" style="height: 0;">
                  <span class="chart-bar__tooltip">7</span>
                </div>
                <span class="chart-bar-label">Jan</span>
              </div>
              <div class="chart-bar-group">
                <div class="chart-bar chart-bar--primary" data-height="90" style="height: 0;">
                  <span class="chart-bar__tooltip">10</span>
                </div>
                <span class="chart-bar-label">Fev</span>
              </div>
              <div class="chart-bar-group">
                <div class="chart-bar chart-bar--success" data-height="54" style="height: 0;">
                  <span class="chart-bar__tooltip">6</span>
                </div>
                <span class="chart-bar-label">Mar</span>
              </div>
            </div>
            <div class="chart-legend">
              <div class="chart-legend__item">
                <div class="chart-legend__dot" style="background: var(--color-primary-500);"></div>
                Normal
              </div>
              <div class="chart-legend__item">
                <div class="chart-legend__dot" style="background: var(--color-warning);"></div>
                Pico
              </div>
              <div class="chart-legend__item">
                <div class="chart-legend__dot" style="background: var(--color-success);"></div>
                Mês Atual
              </div>
            </div>
          </div>

          <div>
            <div class="lgpd-badge">
              <div class="lgpd-badge__icon">🔒</div>
              <div class="lgpd-badge__text">
                <div class="lgpd-badge__title">Privacidade Ativa · LGPD</div>
                <div class="lgpd-badge__desc">O SeniorGuardian <strong>não acessa</strong> o conteúdo de mensagens, apenas metadados de risco. Toda a análise é feita localmente no dispositivo.</div>
              </div>
            </div>

            <div class="card" style="margin-top: var(--space-6);">
              <div class="card__header">
                <span class="card__title">Atividade Recente</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-silver-100);">
                  <span style="font-size: 1.1rem;">🚫</span>
                  <div style="flex:1;">
                    <div style="font-size: var(--font-size-sm); font-weight: 500; color: var(--color-primary-900);">Chamada bloqueada</div>
                    <div style="font-size: var(--font-size-xs); color: var(--color-silver-500);">Há 2 horas</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-silver-100);">
                  <span style="font-size: 1.1rem;">🔗</span>
                  <div style="flex:1;">
                    <div style="font-size: var(--font-size-sm); font-weight: 500; color: var(--color-primary-900);">Link SMS interceptado</div>
                    <div style="font-size: var(--font-size-xs); color: var(--color-silver-500);">Há 5 horas</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0;">
                  <span style="font-size: 1.1rem;">✅</span>
                  <div style="flex:1;">
                    <div style="font-size: var(--font-size-sm); font-weight: 500; color: var(--color-primary-900);">Scan de segurança OK</div>
                    <div style="font-size: var(--font-size-xs); color: var(--color-silver-500);">Há 1 dia</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  // ── Dashboard Animations ──
  function initDashboardAnimations() {
    // Animate counters
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      animateCounter(el, target, 1200);
    });

    // Animate chart bars
    setTimeout(() => {
      document.querySelectorAll('.chart-bar[data-height]').forEach(bar => {
        const h = bar.getAttribute('data-height');
        bar.style.height = h + 'px';
      });
    }, 300);
  }

  function animateCounter(el, target, duration) {
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ============================================
  //  VIEW: Alertas
  // ============================================
  function alertasView() {
    return `
      <div class="page-header">
        <h1>Feed de Alertas</h1>
        <p>Eventos de segurança e ações realizadas em tempo real.</p>
      </div>

      <div class="filter-tabs" id="alertFilters">
        <button class="filter-tab filter-tab--active" data-filter="all">Todos</button>
        <button class="filter-tab" data-filter="blocked">Bloqueados</button>
        <button class="filter-tab" data-filter="attention">Atenção</button>
        <button class="filter-tab" data-filter="info">Informativo</button>
      </div>

      <div class="alerts-feed" id="alertsFeed">

        <div class="alert-card card alert-card--danger" data-type="blocked">
          <div class="alert-card__icon alert-card__icon--danger">☎️</div>
          <div class="alert-card__body">
            <div class="alert-card__title">Falsa Central Bloqueada</div>
            <div class="alert-card__desc">O número <strong>(11) 9999-XXXX</strong>, denunciado como fraude bancária (Banco Central falso), tentou ligar para <strong>Seu Roberto</strong> às 14h30. A chamada foi automaticamente recusada.</div>
            <div class="alert-card__meta">
              <span class="alert-card__tag alert-card__tag--blocked">✓ Bloqueado</span>
              <span>Hoje · 14h30</span>
              <span>Risco: Alto</span>
            </div>
          </div>
        </div>

        <div class="alert-card card alert-card--warning" data-type="blocked">
          <div class="alert-card__icon alert-card__icon--warning">🔗</div>
          <div class="alert-card__body">
            <div class="alert-card__title">Link Malicioso Interceptado</div>
            <div class="alert-card__desc">Uma URL suspeita (<em>bit.ly/pr0m0-xxx</em>) recebida via SMS às 11h15 foi bloqueada com sucesso. O link tentava simular uma página de banco para capturar dados pessoais.</div>
            <div class="alert-card__meta">
              <span class="alert-card__tag alert-card__tag--blocked">✓ Bloqueado</span>
              <span>Hoje · 11h15</span>
              <span>Phishing</span>
            </div>
          </div>
        </div>

        <div class="alert-card card alert-card--warning" data-type="attention">
          <div class="alert-card__icon alert-card__icon--warning">⚠️</div>
          <div class="alert-card__body">
            <div class="alert-card__title">Nova Consulta de CPF Detectada</div>
            <div class="alert-card__desc">Uma nova consulta ao CPF de <strong>Roberto Pradella</strong> foi detectada na base Serasa/Boa Vista. Isso pode indicar uma tentativa de contratação de empréstimo consignado. <strong>Recomendamos ligar para verificar.</strong></div>
            <div class="alert-card__meta">
              <span class="alert-card__tag alert-card__tag--attention">⚡ Requer Ação</span>
              <span>Ontem · 16h42</span>
              <span>Bureau de Crédito</span>
            </div>
          </div>
        </div>

        <div class="alert-card card alert-card--danger" data-type="blocked">
          <div class="alert-card__icon alert-card__icon--danger">☎️</div>
          <div class="alert-card__body">
            <div class="alert-card__title">Tentativa de Contato Suspeito</div>
            <div class="alert-card__desc">O número <strong>(21) 3333-XXXX</strong>, identificado como telemarketing de empréstimo predatório, tentou ligar para <strong>Seu Roberto</strong> 3 vezes consecutivas. Todas as chamadas foram recusadas.</div>
            <div class="alert-card__meta">
              <span class="alert-card__tag alert-card__tag--blocked">✓ Bloqueado</span>
              <span>12 Mar · 09h18</span>
              <span>Risco: Médio</span>
            </div>
          </div>
        </div>

        <div class="alert-card card alert-card--info" data-type="info">
          <div class="alert-card__icon alert-card__icon--info">📊</div>
          <div class="alert-card__body">
            <div class="alert-card__title">Relatório Semanal Disponível</div>
            <div class="alert-card__desc">O relatório da semana 10-16 de Março está pronto. Foram bloqueadas <strong>4 ameaças</strong> e <strong>0 incidentes</strong> passaram pela proteção. Sua assinatura está funcionando como esperado.</div>
            <div class="alert-card__meta">
              <span class="alert-card__tag" style="background: var(--color-info-light); color: var(--color-primary-700);">ℹ Informativo</span>
              <span>11 Mar · 08h00</span>
            </div>
          </div>
        </div>

        <div class="alert-card card alert-card--success" data-type="info">
          <div class="alert-card__icon alert-card__icon--success">✅</div>
          <div class="alert-card__body">
            <div class="alert-card__title">Scan de Segurança Completo</div>
            <div class="alert-card__desc">O scan automático de aplicativos instalados no celular de <strong>Seu Roberto</strong> foi concluído. Nenhum aplicativo malicioso ou não autorizado identificado.</div>
            <div class="alert-card__meta">
              <span class="alert-card__tag alert-card__tag--blocked">✓ Tudo OK</span>
              <span>10 Mar · 03h00</span>
              <span>Automático</span>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  function initAlertFilters() {
    const filterBtns = document.querySelectorAll('#alertFilters .filter-tab');
    const alertCards = document.querySelectorAll('#alertsFeed .alert-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('filter-tab--active'));
        btn.classList.add('filter-tab--active');

        const filter = btn.getAttribute('data-filter');
        alertCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-type') === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ============================================
  //  VIEW: Relatórios
  // ============================================
  function relatoriosView() {
    return `
      <div class="page-header">
        <h1>Relatórios</h1>
        <p>Visão consolidada das métricas de proteção.</p>
      </div>

      <div class="dashboard-grid__metrics" style="margin-bottom: var(--space-8);">
        <div class="card report-stat">
          <div class="report-stat__value" style="color: var(--color-success);">98,7%</div>
          <div class="report-stat__label">Taxa de Proteção</div>
          <div class="report-stat__comparison">↑ 2,3% vs. mês anterior</div>
        </div>
        <div class="card report-stat">
          <div class="report-stat__value">24</div>
          <div class="report-stat__label">Total de Ameaças (Mar)</div>
          <div class="report-stat__comparison">↓ 15% vs. Fevereiro</div>
        </div>
        <div class="card report-stat">
          <div class="report-stat__value" style="color: var(--color-primary-700);">R$ 29,90</div>
          <div class="report-stat__label">Investimento Mensal</div>
          <div class="report-stat__comparison">Custo por ameaça: R$1,25</div>
        </div>
      </div>

      <div class="dashboard-grid__bottom">
        <div class="chart-card card">
          <div class="card__header">
            <span class="card__title">Distribuição de Ameaças por Tipo</span>
          </div>
          <div style="display: flex; gap: var(--space-6); padding: var(--space-6) 0; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 140px; text-align: center;">
              <div style="width: 80px; height: 80px; border-radius: 50%; background: conic-gradient(var(--color-danger) 0% 45%, var(--color-warning) 45% 75%, var(--color-info) 75% 90%, var(--color-silver-200) 90% 100%); margin: 0 auto var(--space-3);"></div>
              <div style="font-size: var(--font-size-xs); color: var(--color-silver-700);">Distribuição Total</div>
            </div>
            <div style="flex: 2; display: flex; flex-direction: column; gap: var(--space-3); justify-content: center;">
              <div style="display: flex; align-items: center; gap: var(--space-3);">
                <div style="width: 12px; height: 12px; border-radius: 3px; background: var(--color-danger); flex-shrink: 0;"></div>
                <span style="font-size: var(--font-size-sm); color: var(--color-silver-700); flex: 1;">Chamadas fraudulentas</span>
                <strong style="font-size: var(--font-size-sm);">45%</strong>
              </div>
              <div style="display: flex; align-items: center; gap: var(--space-3);">
                <div style="width: 12px; height: 12px; border-radius: 3px; background: var(--color-warning); flex-shrink: 0;"></div>
                <span style="font-size: var(--font-size-sm); color: var(--color-silver-700); flex: 1;">Links de phishing</span>
                <strong style="font-size: var(--font-size-sm);">30%</strong>
              </div>
              <div style="display: flex; align-items: center; gap: var(--space-3);">
                <div style="width: 12px; height: 12px; border-radius: 3px; background: var(--color-info); flex-shrink: 0;"></div>
                <span style="font-size: var(--font-size-sm); color: var(--color-silver-700); flex: 1;">Consultas de CPF</span>
                <strong style="font-size: var(--font-size-sm);">15%</strong>
              </div>
              <div style="display: flex; align-items: center; gap: var(--space-3);">
                <div style="width: 12px; height: 12px; border-radius: 3px; background: var(--color-silver-200); flex-shrink: 0;"></div>
                <span style="font-size: var(--font-size-sm); color: var(--color-silver-700); flex: 1;">Outros</span>
                <strong style="font-size: var(--font-size-sm);">10%</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__header">
            <span class="card__title">Resumo do Valor</span>
          </div>
          <div style="padding: var(--space-4) 0; display: flex; flex-direction: column; gap: var(--space-4);">
            <div style="text-align: center; padding: var(--space-4); background: var(--color-success-light); border-radius: var(--radius-md);">
              <div style="font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-success-dark);">R$ 12.450</div>
              <div style="font-size: var(--font-size-xs); color: var(--color-success-dark); margin-top: var(--space-1);">Estimativa de prejuízo evitado</div>
            </div>
            <div style="font-size: var(--font-size-sm); color: var(--color-silver-700); line-height: 1.7;">
              Com base nas <strong>24 ameaças bloqueadas</strong> este mês, estimamos que o SeniorGuardian evitou perdas financeiras significativas para Seu Roberto.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ============================================
  //  VIEW: Configurações
  // ============================================
  function configuracoesView() {
    return `
      <div class="page-header">
        <h1>Configurações</h1>
        <p>Ajuste o nível de proteção e gerencie preferências do Modo Guardião.</p>
      </div>

      <div class="settings-grid">

        <!-- Rigidez -->
        <div class="card">
          <div class="card__header">
            <span class="card__title">Nível de Proteção</span>
          </div>
          <p style="font-size: var(--font-size-sm); margin-bottom: var(--space-4);">
            Ajuste o nível de rigidez da blindagem. No modo <strong>Máxima</strong>, todas as chamadas de números desconhecidos são bloqueadas automaticamente.
          </p>

          <div class="toggle-group" id="protectionToggle">
            <button class="toggle-group__option" data-level="leve">Leve</button>
            <button class="toggle-group__option toggle-group__option--active" data-level="padrao">Padrão</button>
            <button class="toggle-group__option" data-level="maxima">Máxima</button>
          </div>

          <div class="range-slider" style="margin-top: var(--space-6);">
            <label style="font-size: var(--font-size-sm); font-weight: 500; color: var(--color-primary-900); display: block; margin-bottom: var(--space-2);">
              Sensibilidade de detecção
            </label>
            <input type="range" id="sensitivitySlider" min="1" max="10" value="7" aria-label="Sensibilidade">
            <div class="range-slider__labels">
              <span class="range-slider__label">Menos alertas</span>
              <span class="range-slider__label" id="sensitivityValue" style="font-weight: 600; color: var(--color-primary-900);">7/10</span>
              <span class="range-slider__label">Mais proteção</span>
            </div>
          </div>
        </div>

        <!-- Lista Branca -->
        <div class="card">
          <div class="card__header">
            <span class="card__title">Lista Branca · Contatos Seguros</span>
            <button class="btn btn--primary btn--sm" id="addContactBtn">+ Adicionar</button>
          </div>
          <p style="font-size: var(--font-size-sm); margin-bottom: var(--space-4); color: var(--color-silver-700);">
            A agenda de <strong>Seu Roberto</strong> está sincronizada. Os contatos abaixo nunca serão bloqueados.
          </p>

          <div class="contact-list">
            <div class="contact-item">
              <div class="contact-item__avatar" style="background: linear-gradient(135deg, #10B981, #059669);">MP</div>
              <div class="contact-item__info">
                <div class="contact-item__name">Marcelo Pradella</div>
                <div class="contact-item__role">Filho · Guardião</div>
              </div>
              <span class="contact-item__status">Aprovado</span>
            </div>

            <div class="contact-item">
              <div class="contact-item__avatar" style="background: linear-gradient(135deg, #3B82F6, #1E3A8A);">AP</div>
              <div class="contact-item__info">
                <div class="contact-item__name">Ana Pradella</div>
                <div class="contact-item__role">Filha</div>
              </div>
              <span class="contact-item__status">Aprovado</span>
            </div>

            <div class="contact-item">
              <div class="contact-item__avatar" style="background: linear-gradient(135deg, #8B5CF6, #6D28D9);">DS</div>
              <div class="contact-item__info">
                <div class="contact-item__name">Dr. Silva</div>
                <div class="contact-item__role">Médico · Cardiologista</div>
              </div>
              <span class="contact-item__status">Aprovado</span>
            </div>

            <div class="contact-item">
              <div class="contact-item__avatar" style="background: linear-gradient(135deg, #F59E0B, #D97706);">FM</div>
              <div class="contact-item__info">
                <div class="contact-item__name">Farmácia Mantovani</div>
                <div class="contact-item__role">Farmácia</div>
              </div>
              <span class="contact-item__status">Aprovado</span>
            </div>
          </div>
        </div>

        <!-- Notificações -->
        <div class="card">
          <div class="card__header">
            <span class="card__title">Preferências de Notificação</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
              <div>
                <div style="font-size: var(--font-size-sm); font-weight: 500;">Alertas em tempo real</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-silver-500);">Receba push a cada ameaça bloqueada</div>
              </div>
              <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: var(--color-primary-700);">
            </label>
            <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding-top: var(--space-3); border-top: 1px solid var(--color-silver-100);">
              <div>
                <div style="font-size: var(--font-size-sm); font-weight: 500;">Relatório semanal por e-mail</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-silver-500);">Resumo toda segunda-feira às 8h</div>
              </div>
              <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: var(--color-primary-700);">
            </label>
            <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding-top: var(--space-3); border-top: 1px solid var(--color-silver-100);">
              <div>
                <div style="font-size: var(--font-size-sm); font-weight: 500;">Alerta de consulta de CPF</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-silver-500);">Notificar quando houver consulta Serasa/Boa Vista</div>
              </div>
              <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: var(--color-primary-700);">
            </label>
            <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding-top: var(--space-3); border-top: 1px solid var(--color-silver-100);">
              <div>
                <div style="font-size: var(--font-size-sm); font-weight: 500;">Som de alerta</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-silver-500);">Tocar som ao receber alerta crítico</div>
              </div>
              <input type="checkbox" style="width: 20px; height: 20px; accent-color: var(--color-primary-700);">
            </label>
          </div>
        </div>

        <!-- Pânico Virtual -->
        <div class="panic-section">
          <div class="panic-section__title">🚨 Pânico Virtual</div>
          <div class="panic-section__desc">
            Use este botão <strong>apenas em emergências</strong>. Ele força um bloqueio temporário de todas as chamadas e SMS no dispositivo de Seu Roberto por 30 minutos.
          </div>
          <button class="panic-btn" id="panicBtn">
            <span class="panic-btn__icon">🔴</span>
            Ativar Bloqueio de Emergência
          </button>
        </div>
      </div>
    `;
  }

  function initConfigInteractions() {
    // Toggle group
    const toggleBtns = document.querySelectorAll('#protectionToggle .toggle-group__option');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('toggle-group__option--active'));
        btn.classList.add('toggle-group__option--active');
      });
    });

    // Sensitivity slider
    const slider = document.getElementById('sensitivitySlider');
    const sliderValue = document.getElementById('sensitivityValue');
    if (slider && sliderValue) {
      slider.addEventListener('input', () => {
        sliderValue.textContent = `${slider.value}/10`;
      });
    }

    // Panic button
    const panicBtn = document.getElementById('panicBtn');
    if (panicBtn) {
      panicBtn.addEventListener('click', () => {
        if (confirm('⚠️ ATENÇÃO: Tem certeza que deseja ativar o Bloqueio de Emergência?\n\nTodas as chamadas e SMS serão bloqueados no dispositivo de Seu Roberto por 30 minutos.')) {
          panicBtn.innerHTML = '<span class="panic-btn__icon">⏳</span> Bloqueio Ativo — 29:59';
          panicBtn.style.background = '#991B1B';
          panicBtn.disabled = true;

          let seconds = 1799;
          const timer = setInterval(() => {
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            panicBtn.innerHTML = `<span class="panic-btn__icon">⏳</span> Bloqueio Ativo — ${m}:${String(s).padStart(2, '0')}`;
            seconds--;
            if (seconds < 0) {
              clearInterval(timer);
              panicBtn.innerHTML = '<span class="panic-btn__icon">🔴</span> Ativar Bloqueio de Emergência';
              panicBtn.style.background = '';
              panicBtn.disabled = false;
            }
          }, 1000);
        }
      });
    }

    // Add contact button
    const addBtn = document.getElementById('addContactBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const name = prompt('Nome do contato:');
        if (name) {
          const role = prompt('Relação (ex: Médico, Familiar, Farmácia):') || 'Contato';
          const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
          const colors = ['#10B981,#059669', '#3B82F6,#1E3A8A', '#8B5CF6,#6D28D9', '#F59E0B,#D97706', '#EF4444,#DC2626'];
          const color = colors[Math.floor(Math.random() * colors.length)];

          const contactList = document.querySelector('.contact-list');
          if (contactList) {
            const newItem = document.createElement('div');
            newItem.className = 'contact-item';
            newItem.style.animation = 'slideInUp 0.3s ease forwards';
            newItem.innerHTML = `
              <div class="contact-item__avatar" style="background: linear-gradient(135deg, ${color});">${initials}</div>
              <div class="contact-item__info">
                <div class="contact-item__name">${name}</div>
                <div class="contact-item__role">${role}</div>
              </div>
              <span class="contact-item__status">Aprovado</span>
            `;
            contactList.appendChild(newItem);
          }
        }
      });
    }
  }

  // ── Initial render ──
  renderView('dashboard');

  // ============================================
  //  MOBILE SIMULATOR — Installation Walkthrough
  // ============================================

  const simulatorBtn = document.getElementById('simulatorBtn');
  let simulatorOverlay = null;
  let simulatorStep = 0;

  // ── Simulator Steps Data ──
  const simulatorSteps = [
    {
      icon: 'shield',
      iconSvg: '<svg viewBox="0 0 24 24"><path d="M12 2 L22 7 V12 C22 17.5 12 22 12 22 C12 22 2 17.5 2 12 V7 Z"/><path d="M9 12 L11 14 L15 10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      title: 'Bem-vindo ao SeniorGuardian.',
      text: 'Este aplicativo funciona como um <strong>Airbag Digital</strong>. Nós bloqueamos ligações falsas e links perigosos automaticamente, para que você navegue com total liberdade e segurança.',
      btnText: 'Começar',
      btnType: 'primary'
    },
    {
      icon: 'lock',
      iconSvg: '<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/></svg>',
      title: 'Como vamos te proteger?',
      text: 'Para bloquear fraudes antes que elas cheguem a você, o seu celular (Android) precisa que você libere duas permissões. Fique tranquilo: <strong>não temos acesso às suas senhas</strong>, não lemos suas conversas privadas do WhatsApp e <strong>não alteramos nada no seu banco</strong>.',
      btnText: 'Entendi, avançar',
      btnType: 'primary'
    },
    {
      icon: 'family',
      iconSvg: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      title: 'Conexão Familiar',
      text: 'Você foi convidado(a) por <strong>[Marcelo — Seu Filho]</strong> para compartilhar os alertas de segurança. Ele será avisado caso uma ameaça tente atacar seu aparelho.',
      btnText: 'Autorizar e Conectar',
      btnType: 'primary',
      hasCheckbox: true,
      checkboxText: 'Declaro que autorizo meu filho(a) a receber alertas de segurança do meu dispositivo.'
    },
    {
      icon: 'success',
      iconSvg: '<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      title: 'Dispositivo Blindado! 🛡️',
      text: 'Tudo pronto. Seu celular agora está <strong>protegido contra golpes e fraudes</strong>. Pode fechar o aplicativo e usar seu celular normalmente.',
      btnText: 'Fechar Simulador',
      btnType: 'close'
    }
  ];

  function getSimulatorTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  }

  function buildStepHTML(step, index) {
    let checkboxHTML = '';
    if (step.hasCheckbox) {
      checkboxHTML = `
        <label class="simulator__checkbox-wrap" for="simConsent">
          <input type="checkbox" class="simulator__checkbox-input" id="simConsent">
          <span class="simulator__checkbox-label">${step.checkboxText}</span>
        </label>
      `;
    }

    const isDisabled = step.hasCheckbox ? ' simulator__btn--disabled' : '';
    const disabledAttr = step.hasCheckbox ? ' disabled' : '';
    const btnClass = step.btnType === 'close' ? 'simulator__btn simulator__btn--close' : `simulator__btn simulator__btn--primary${isDisabled}`;
    const activeClass = index === 0 ? ' simulator-step--active' : '';

    return `
      <div class="simulator-step${activeClass}" data-step="${index}">
        <div class="simulator__icon simulator__icon--${step.icon}">
          ${step.iconSvg}
        </div>
        <h2 class="simulator__title">${step.title}</h2>
        <p class="simulator__text">${step.text}</p>
        ${checkboxHTML}
        <button class="${btnClass}" id="simBtn${index}"${disabledAttr}>${step.btnText}</button>
      </div>
    `;
  }

  function buildProgressDots() {
    return simulatorSteps.map((_, i) =>
      `<div class="simulator__dot${i === 0 ? ' simulator__dot--active' : ''}" data-dot="${i}"></div>`
    ).join('');
  }

  function openSimulator() {
    simulatorStep = 0;

    const stepsHTML = simulatorSteps.map((s, i) => buildStepHTML(s, i)).join('');

    const overlayEl = document.createElement('div');
    overlayEl.className = 'simulator-overlay';
    overlayEl.id = 'simulatorOverlay';
    overlayEl.innerHTML = `
      <div class="simulator-phone" id="simulatorPhone">
        <button class="simulator-phone__close" id="simCloseBtn" aria-label="Fechar simulador">&times;</button>

        <div class="simulator-phone__notch">
          <span class="simulator-phone__notch-time">${getSimulatorTime()}</span>
          <div class="simulator-phone__notch-icons">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1l22 22"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg>
          </div>
        </div>

        <div class="simulator-phone__screen">
          ${stepsHTML}
        </div>

        <div class="simulator__progress" id="simProgress">
          ${buildProgressDots()}
        </div>
      </div>
    `;

    document.body.appendChild(overlayEl);
    simulatorOverlay = overlayEl;

    // Close on overlay click (outside phone)
    overlayEl.addEventListener('click', (e) => {
      if (e.target === overlayEl) closeSimulator();
    });

    // Close button
    document.getElementById('simCloseBtn').addEventListener('click', closeSimulator);

    // Step buttons
    simulatorSteps.forEach((step, i) => {
      const btn = document.getElementById(`simBtn${i}`);
      if (!btn) return;

      if (i < simulatorSteps.length - 1) {
        btn.addEventListener('click', () => goToStep(i + 1));
      } else {
        // Last step = close
        btn.addEventListener('click', closeSimulator);
      }
    });

    // Checkbox on step 3
    setTimeout(() => {
      const checkbox = document.getElementById('simConsent');
      const authBtn = document.getElementById('simBtn2');
      if (checkbox && authBtn) {
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            authBtn.disabled = false;
            authBtn.classList.remove('simulator__btn--disabled');
          } else {
            authBtn.disabled = true;
            authBtn.classList.add('simulator__btn--disabled');
          }
        });
      }
    }, 100);

    // Escape key
    document.addEventListener('keydown', handleSimEscape);
  }

  function closeSimulator() {
    if (!simulatorOverlay) return;

    simulatorOverlay.classList.add('simulator-overlay--closing');
    setTimeout(() => {
      if (simulatorOverlay && simulatorOverlay.parentNode) {
        simulatorOverlay.parentNode.removeChild(simulatorOverlay);
      }
      simulatorOverlay = null;
      document.removeEventListener('keydown', handleSimEscape);
    }, 300);
  }

  function goToStep(newStep) {
    if (!simulatorOverlay) return;

    const allSteps = simulatorOverlay.querySelectorAll('.simulator-step');
    const allDots = simulatorOverlay.querySelectorAll('.simulator__dot');

    // Exit current step
    allSteps[simulatorStep].classList.remove('simulator-step--active');
    allSteps[simulatorStep].classList.add('simulator-step--exiting');

    // Enter new step
    setTimeout(() => {
      allSteps[simulatorStep].classList.remove('simulator-step--exiting');
      allSteps[newStep].classList.add('simulator-step--active');
      simulatorStep = newStep;
    }, 150);

    // Update dots
    allDots.forEach((dot, i) => {
      dot.classList.remove('simulator__dot--active', 'simulator__dot--completed');
      if (i === newStep) {
        dot.classList.add('simulator__dot--active');
      } else if (i < newStep) {
        dot.classList.add('simulator__dot--completed');
      }
    });
  }

  function handleSimEscape(e) {
    if (e.key === 'Escape') closeSimulator();
  }

  // Wire up the simulator button
  if (simulatorBtn) {
    simulatorBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSimulator();
    });
  }

})();
