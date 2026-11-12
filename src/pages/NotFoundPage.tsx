import LinkButton from '../components/ui/LinkButton';
import { usePageMeta } from '../lib/router';

export default function NotFoundPage() {
  usePageMeta('페이지를 찾을 수 없습니다 | Anywhere', '요청하신 페이지를 찾을 수 없습니다.');
  return (
    <section className="nf">
      <div className="wrap nf-in">
        <p className="label center">404</p>
        <h1 className="dp-title">페이지를 찾을 수 없습니다.</h1>
        <LinkButton to="/">Back to Home</LinkButton>
      </div>
    </section>
  );
}
