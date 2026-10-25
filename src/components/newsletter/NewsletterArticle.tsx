import ReactMarkdown from 'react-markdown';
import './newsletter-article.css';

export interface NewsletterArticleData {
  title: string;
  summary: string | null;
  content_markdown: string;
  published_at?: string | null;
  edition_number?: number | null;
  editorial_theme?: string | null;
}

// Keep this presentation contract identical in Admin, web and Mi ACIA.
export function NewsletterArticle({ article, preview = false }: { article: NewsletterArticleData; preview?: boolean }) {
  const date = article.published_at ? new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeZone: 'America/Bogota' }).format(new Date(article.published_at)) : null;
  return <article className="acia-editorial" data-presentation="acia-editorial-1">
    <header className="acia-editorial-header">
      <div className="acia-editorial-masthead"><span>ACIA <b>al día</b></span><span>{article.edition_number ? `Edición ${String(article.edition_number).padStart(2, '0')}` : preview ? 'Vista previa · sin publicar' : 'Ideas para nuestra comunidad'}</span></div>
      <div className="acia-editorial-heading">
        <p className="acia-editorial-eyebrow">{article.editorial_theme || 'INTELIGENCIA ARTIFICIAL · COLOMBIA'}</p>
        <h1>{article.title}</h1>
        {article.summary && <p className="acia-editorial-summary">{article.summary}</p>}
        <div className="acia-editorial-byline"><span>Equipo editorial ACIA</span>{date && <time dateTime={article.published_at ?? undefined}>{date}</time>}</div>
      </div>
    </header>
    <div className="acia-editorial-body"><ReactMarkdown
      skipHtml
      allowedElements={['p','h1','h2','h3','h4','strong','em','a','ul','ol','li','blockquote','code','pre','hr','br']}
      urlTransform={url => /^mailto:[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(url) ? url : /^https?:\/\//i.test(url) ? url : url.startsWith('#') ? url : ''}
      components={{ h1: ({ children }) => <h2>{children}</h2>, a: ({ href, children }) => href ? <a href={href} rel="noopener noreferrer">{children}</a> : <span>{children}</span> }}
    >{article.content_markdown}</ReactMarkdown></div>
    <footer className="acia-editorial-footer">ACIA al día<span>Asociación Colombiana de Inteligencia Artificial</span></footer>
  </article>;
}
