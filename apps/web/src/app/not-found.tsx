import { ActionLink } from '../components/ui';
export default function NotFound() {
  return <main id="main-content" className="container not-found"><p className="eyebrow">404 / PAGE NOT FOUND</p><h1>We could not find that page.</h1><p>The link may have changed. You can return to the Maxbet homepage.</p><ActionLink href="/">Back to Maxbet</ActionLink></main>;
}
