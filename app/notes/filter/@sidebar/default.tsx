import { TagLink } from '../../../../components/TagLink/TagLink';
import css from './SidebarNotes.module.css';

const tags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function SidebarDefault() {
  return (
    <aside className={css.sidebar}>
      <h3 className={css.title}>Categories</h3>
      <nav className={css.nav}>
        <ul className={css.tagList}>
          {/* Посилання "All notes" використовує той самий TagLink */}
          <li className={css.tagItem}>
            <TagLink href="/notes/filter/all">All notes</TagLink>
          </li>

          {/* Усі теги використовують той самий TagLink */}
          {tags.map(tag => (
            <li key={tag} className={css.tagItem}>
              <TagLink href={`/notes/filter/${encodeURIComponent(tag)}`}>
                #{tag}
              </TagLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
