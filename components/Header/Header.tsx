import Link from 'next/link';
import AuthNavigation from '../AuthNavigation/AuthNavigation';
import css from './Header.module.css';

export const Header = () => {
  return (
    <header className={css.header}>
      <nav className={css.nav}>
        <ul className={css.navigationList}>
          <li className={css.navigationItem}>
            <Link href="/" className={css.navigationLink}>
              Home
            </Link>
          </li>

          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
};

export default Header;