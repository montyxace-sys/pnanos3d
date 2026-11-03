/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import {
  Search, TrendingUp, Gauge, Smartphone, Globe, MapPin, Tag,
  BarChart3, Target, Code, ShoppingBag, Calendar, FileSpreadsheet,
  ExternalLink, Star, LineChart, Users, Zap,
  CheckCircle2, AlertTriangle, Loader2,
} from 'lucide-react';

type Tool = {
  id: string;
  icon: typeof Search;
  title: string;
  desc: string;
  url: string;
  color: string;
  category: 'Analítica' | 'SEO' | 'Search' | 'Negocio' | 'Publicidad' | 'Productividad';
};

const TOOLS: Tool[] = [
  {
    id: 'search-console',
    icon: Search,
    title: 'Google Search Console',
    desc: 'Impresiones, clics, posición media, errores de indexación y estado de cobertura.',
    url: 'https://search.google.com/search-console',
    color: 'primary',
    category: 'SEO',
  },
  {
    id: 'analytics-4',
    icon: BarChart3,
    title: 'Google Analytics 4',
    desc: 'Tráfico, comportamiento de usuarios, conversiones y eventos en tiempo real.',
    url: 'https://analytics.google.com',
    color: 'success',
    category: 'Analítica',
  },
  {
    id: 'pagespeed',
    icon: Gauge,
    title: 'PageSpeed Insights',
    desc: 'Velocidad de carga en móvil y escritorio con recomendaciones de optimización.',
    url: 'https://pagespeed.web.dev/analysis?url=https://tusplanos3d.es/',
    color: 'accent',
    category: 'Analítica',
  },
  {
    id: 'mobile-friendly',
    icon: Smartphone,
    title: 'Mobile-Friendly Test',
    desc: 'Verifica que la web está optimizada para dispositivos móviles.',
    url: 'https://search.google.com/test/mobile-friendly?url=https://tusplanos3d.es/',
    color: 'warning',
    category: 'SEO',
  },
  {
    id: 'rich-results',
    icon: Globe,
    title: 'Rich Results Test',
    desc: 'Valida datos estructurados y rich snippets en los resultados de Google.',
    url: 'https://search.google.com/test/rich-results?url=https://tusplanos3d.es/',
    color: 'primary',
    category: 'SEO',
  },
  {
    id: 'business-profile',
    icon: MapPin,
    title: 'Google Business Profile',
    desc: 'Gestiona la ficha de Google: fotos, horarios, servicios, reseñas y posts.',
    url: 'https://business.google.com',
    color: 'success',
    category: 'Negocio',
  },
  {
    id: 'tag-manager',
    icon: Code,
    title: 'Google Tag Manager',
    desc: 'Gestiona etiquetas de seguimiento sin tocar el código de la web.',
    url: 'https://tagmanager.google.com',
    color: 'accent',
    category: 'Analítica',
  },
  {
    id: 'ads',
    icon: Target,
    title: 'Google Ads',
    desc: 'Crea y gestiona campañas publicitarias en búsqueda, display y YouTube.',
    url: 'https://ads.google.com',
    color: 'warning',
    category: 'Publicidad',
  },
  {
    id: 'keyword-planner',
    icon: Tag,
    title: 'Keyword Planner',
    desc: 'Investiga volumen de búsquedas y ideas de palabras clave para SEO y SEM.',
    url: 'https://ads.google.com/aw/keywordplanner',
    color: 'primary',
    category: 'Search',
  },
  {
    id: 'trends',
    icon: TrendingUp,
    title: 'Google Trends',
    desc: 'Compara tendencias de búsqueda por término, zona y periodo temporal.',
    url: 'https://trends.google.com/trends/explore?q=aire%20acondicionado%20Sevilla&geo=ES',
    color: 'success',
    category: 'Search',
  },
  {
    id: 'looker-studio',
    icon: LineChart,
    title: 'Looker Studio',
    desc: 'Crea dashboards visuales combinando datos de Analytics, Search Console y Ads.',
    url: 'https://lookerstudio.google.com',
    color: 'accent',
    category: 'Analítica',
  },
  {
    id: 'merchant',
    icon: ShoppingBag,
    title: 'Merchant Center',
    desc: 'Gestiona el catálogo de productos para anuncios de Shopping.',
    url: 'https://merchants.google.com',
    color: 'warning',
    category: 'Publicidad',
  },
  {
    id: 'schema-validator',
    icon: Code,
    title: 'Schema.org Validator',
    desc: 'Validación completa de todos los esquemas Schema.org implementados.',
    url: 'https://validator.schema.org/#url=https://tusplanos3d.es/',
    color: 'primary',
    category: 'SEO',
  },
  {
    id: 'sheets',
    icon: FileSpreadsheet,
    title: 'Google Sheets',
    desc: 'Hojas de cálculo colaborativas para presupuestos, inventario y seguimientos.',
    url: 'https://sheets.google.com',
    color: 'success',
    category: 'Productividad',
  },
  {
    id: 'calendar',
    icon: Calendar,
    title: 'Google Calendar',
    desc: 'Calendario compartido para visitas técnicas, instalaciones y reuniones.',
    url: 'https://calendar.google.com',
    color: 'accent',
    category: 'Productividad',
  },
];

const CATEGORIES = ['Analítica', 'SEO', 'Search', 'Negocio', 'Publicidad', 'Productividad'] as const;

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  primary: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'hover:border-orange-300' },
  success: { bg: 'bg-green-50', text: 'text-green-600', border: 'hover:border-green-300' },
  accent: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'hover:border-blue-300' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'hover:border-amber-300' },
};

const MAPS_EMBED = 'https://www.google.com/maps?q=Climatizaciones+Monta%C3%B1o+Sevilla&output=embed';

type Tab = 'herramientas' | 'pagespeed' | 'mapa' | 'tendencias';

export function GoogleTools() {
  const [activeTab, setActiveTab] = useState<Tab>('herramientas');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const filteredTools = categoryFilter === 'all'
    ? TOOLS
    : TOOLS.filter((t) => t.category === categoryFilter);

  const tabs: { id: Tab; label: string; icon: typeof Search }[] = [
    { id: 'herramientas', label: 'Herramientas', icon: Zap },
    { id: 'pagespeed', label: 'PageSpeed', icon: Gauge },
    { id: 'mapa', label: 'Google Maps', icon: MapPin },
    { id: 'tendencias', label: 'Tendencias', icon: TrendingUp },
  ];

  const copyVerificationCode = () => {
    navigator.clipboard.writeText('google-site-verification=tusplanos3d.es');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Herramientas de Google</h1>
        <p className="text-muted text-sm mt-1">Analítica, SEO, búsqueda y productividad de Google en un solo panel</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === t.id ? 'bg-gray-900 text-white' : 'bg-white text-ink-soft border border-line hover:bg-paper-2'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'herramientas' && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                categoryFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-ink-soft border border-line'
              }`}
            >
              Todas ({TOOLS.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = TOOLS.filter((t) => t.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                    categoryFilter === cat ? 'bg-gray-900 text-white' : 'bg-white text-ink-soft border border-line'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              const c = COLOR_MAP[tool.color];
              return (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-white rounded-2xl p-5 border border-line shadow-sm hover:shadow-md transition-all group hover:-translate-y-0.5 ${c.border}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-semibold text-ink truncate">{tool.title}</h4>
                        <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-orange-600 transition-colors flex-shrink-0" />
                      </div>
                      <p className="text-xs text-muted mt-1 leading-relaxed">{tool.desc}</p>
                      <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-line shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="font-display font-semibold text-ink">Estado de integraciones</h3>
              </div>
              <div className="space-y-3">
                <IntegrationRow icon={Globe} title="Google Search Console" status="pending" desc="Registra y verifica la propiedad para monitorizar indexación" />
                <IntegrationRow icon={BarChart3} title="Google Analytics 4" status="pending" desc="Conecta GA4 para análisis detallado de tráfico" />
                <IntegrationRow icon={MapPin} title="Google Business Profile" status="connected" desc="Ficha activa con reseñas y datos de empresa" />
                <IntegrationRow icon={Gauge} title="PageSpeed Insights" status="connected" desc="Análisis de velocidad disponible en la pestaña PageSpeed" />
                <IntegrationRow icon={Code} title="Schema.org" status="connected" desc="LocalBusiness, FAQPage y BreadcrumbList validados" />
                <IntegrationRow icon={Star} title="Rich Results Test" status="connected" desc="Rich snippets de reseñas y FAQ validados" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-line shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-orange-600" />
                <h3 className="font-display font-semibold text-ink">Verificación de Search Console</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Para verificar la propiedad de tusplanos3d.es en Google Search Console, añade un registro DNS o usa la etiqueta HTML. Copia el código y añádelo en tu configuración de dominio.
              </p>
              <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between gap-3">
                <code className="text-xs text-muted font-mono truncate">google-site-verification=tusplanos3d.es</code>
                <button
                  onClick={copyVerificationCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-medium text-white transition-colors flex-shrink-0"
                >
                  {copied ? (
                    <><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Copiado</>
                  ) : (
                    <><Code className="w-3.5 h-3.5" /> Copiar</>
                  )}
                </button>
              </div>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    El código real lo genera Google Search Console al añadir tu propiedad. Sustituye este texto por el que Google te proporcione.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-line shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-orange-600" />
              <h3 className="font-display font-semibold text-ink">Guía rápida de configuración</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <GuideStep step={1} title="Search Console" desc="Registra tusplanos3d.es y envía el sitemap para acelerar indexación." url="https://search.google.com/search-console" />
              <GuideStep step={2} title="Analytics 4" desc="Crea una propiedad GA4 y añade el código de seguimiento." url="https://analytics.google.com" />
              <GuideStep step={3} title="Tag Manager" desc="Instala GTM para gestionar etiquetas sin tocar código." url="https://tagmanager.google.com" />
              <GuideStep step={4} title="Business Profile" desc="Completa la ficha con fotos, servicios y horarios." url="https://business.google.com" />
              <GuideStep step={5} title="PageSpeed" desc="Analiza y optimiza la velocidad de carga en móvil." url="https://pagespeed.web.dev/analysis?url=https://tusplanos3d.es/" />
              <GuideStep step={6} title="Rich Results" desc="Valida datos estructurados para rich snippets." url="https://search.google.com/test/rich-results?url=https://tusplanos3d.es/" />
            </div>
          </div>
        </>
      )}

      {activeTab === 'pagespeed' && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="p-4 border-b border-line flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-orange-600" />
              <h3 className="font-display font-semibold text-ink">PageSpeed Insights — tusplanos3d.es</h3>
            </div>
            <a
              href="https://pagespeed.web.dev/analysis?url=https://tusplanos3d.es/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-paper-2 hover:bg-paper-2 rounded-lg text-xs font-medium text-ink-soft transition-colors"
            >
              Abrir en Google <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="bg-paper-2 flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted">PageSpeed Insights no permite incrustación directa.</p>
              <a
                href="https://pagespeed.web.dev/analysis?url=https://tusplanos3d.es/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Analizar tusplanos3d.es <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mapa' && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="p-4 border-b border-line flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <h3 className="font-display font-semibold text-ink">Google Maps — Climatizaciones Montaño</h3>
            </div>
            <a
              href="https://www.google.com/maps/search/Climatizaciones+Montaño+Sevilla"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-paper-2 hover:bg-paper-2 rounded-lg text-xs font-medium text-ink-soft transition-colors"
            >
              Abrir en Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <iframe
            src={MAPS_EMBED}
            className="w-full h-[480px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps — Climatizaciones Montaño"
          />
        </div>
      )}

      {activeTab === 'tendencias' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
            <div className="p-4 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <h3 className="font-display font-semibold text-ink">Tendencias — "aire acondicionado Sevilla"</h3>
              </div>
              <a
                href="https://trends.google.com/trends/explore?q=aire%20acondicionado%20Sevilla&geo=ES"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-paper-2 hover:bg-paper-2 rounded-lg text-xs font-medium text-ink-soft transition-colors"
              >
                Abrir en Trends <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="bg-paper-2 flex items-center justify-center py-16">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                <p className="text-sm text-muted">Google Trends no permite incrustación directa en este panel.</p>
                <a
                  href="https://trends.google.com/trends/explore?q=aire%20acondicionado%20Sevilla&geo=ES"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Ver tendencias <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <TrendCard term="instalación aire acondicionado Sevilla" />
            <TrendCard term="aerotermia Sevilla" />
            <TrendCard term="mantenimiento aire acondicionado Sevilla" />
            <TrendCard term="reparación aire acondicionado Sevilla" />
          </div>
        </div>
      )}
    </div>
  );
}

function IntegrationRow({ icon: Icon, title, status, desc }: { icon: typeof Search; title: string; status: 'connected' | 'pending'; desc: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-paper-2 transition-colors">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
        status === 'connected' ? 'bg-green-50' : 'bg-paper-2'
      }`}>
        <Icon className={`w-4 h-4 ${status === 'connected' ? 'text-green-600' : 'text-muted'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink">{title}</span>
          {status === 'connected' ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-600">
              <CheckCircle2 className="w-3 h-3" /> Conectado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
              <AlertTriangle className="w-3 h-3" /> Pendiente
            </span>
          )}
        </div>
        <p className="text-xs text-muted mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function GuideStep({ step, title, desc, url }: { step: number; title: string; desc: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-paper-2 rounded-xl hover:bg-orange-50 transition-colors group"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-6 h-6 rounded-lg bg-orange-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {step}
        </span>
        <h4 className="text-sm font-semibold text-ink flex items-center gap-1.5">
          {title}
          <ExternalLink className="w-3 h-3 text-muted group-hover:text-orange-600 transition-colors" />
        </h4>
      </div>
      <p className="text-xs text-muted leading-relaxed">{desc}</p>
    </a>
  );
}

function TrendCard({ term }: { term: string }) {
  const url = `https://trends.google.com/trends/explore?q=${encodeURIComponent(term)}&geo=ES`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-2xl p-4 border border-line shadow-sm hover:shadow-md transition-all group hover:-translate-y-0.5 flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
        <TrendingUp className="w-5 h-5 text-orange-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-ink truncate">{term}</h4>
        <p className="text-xs text-muted mt-0.5">Ver tendencia en Google Trends</p>
      </div>
      <ExternalLink className="w-4 h-4 text-muted group-hover:text-orange-600 transition-colors flex-shrink-0" />
    </a>
  );
}

export default GoogleTools;
