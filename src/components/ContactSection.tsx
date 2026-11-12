import { useId, useState, type FormEvent } from 'react';
import { site } from '../config/site';
import SectionLabel from './ui/SectionLabel';
import SplitLines from './ui/SplitLines';
import { ArrowRight, InfoCircle } from './ui/Icons';

type Kind = 'partnership' | 'service';
type Status = 'idle' | 'sending' | 'sent' | 'error' | 'unavailable';
type Errors = Partial<Record<'name' | 'email' | 'message' | 'agree', string>>;

const KIND_LABEL: Record<Kind, string> = { partnership: '협업 및 제휴 문의', service: '서비스 관련 문의' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * SECTION 07 — CONTACT
 * - 이메일: VITE_CONTACT_EMAIL 이 설정된 경우에만 노출
 * - 전송: VITE_CONTACT_ENDPOINT 가 설정되고 서버가 성공(2xx)을 응답한 경우에만 성공 메시지 표시
 */
export default function ContactSection() {
  const uid = useId();
  const [kind, setKind] = useState<Kind>('partnership');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      kind,
      name: String(fd.get('name') ?? '').trim(),
      organization: String(fd.get('organization') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      message: String(fd.get('message') ?? '').trim(),
    };
    const next: Errors = {};
    if (!data.name) next.name = '이름을 입력해주세요.';
    if (!EMAIL_RE.test(data.email)) next.email = '올바른 이메일 주소를 입력해주세요.';
    if (!data.message) next.message = '문의 내용을 입력해주세요.';
    if (!fd.get('agree')) next.agree = '개인정보 수집 · 이용에 동의해주세요.';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = Object.keys(next)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    if (!site.contactEndpoint) {
      setStatus('unavailable');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(site.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  const mailto = site.contactEmail
    ? `mailto:${site.contactEmail}?subject=${encodeURIComponent(`[TripAI] ${KIND_LABEL[kind]}`)}`
    : null;

  const fid = (n: string) => `${uid}-${n}`;
  const errProps = (n: keyof Errors) =>
    errors[n] ? { 'aria-invalid': true as const, 'aria-describedby': fid(`${n}-err`) } : {};

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap ct-grid">
        <div className="ct-l">
          <SectionLabel index="07">Contact</SectionLabel>
          <SplitLines id="contact-title" className="h2-en" lines={['Let’s Create', 'the Next Journey.']} />
          <p className="kr" data-reveal="fade">
            새로운 여행의 가능성을 함께 만들어갑니다.
          </p>
          <ul className="kinds">
            <li data-reveal="fade">
              <span className="num">01</span>
              <h3>협업 및 제휴 문의</h3>
              <p>TripAI와 함께 새로운 여행 경험을 만들어갈 협업과 제휴 제안을 기다립니다.</p>
            </li>
            <li data-reveal="fade">
              <span className="num">02</span>
              <h3>서비스 관련 문의</h3>
              <p>TripAI 서비스에 대해 궁금한 점이나 의견을 남겨주세요.</p>
            </li>
          </ul>
          {site.contactEmail && (
            <a className="mail" href={`mailto:${site.contactEmail}`} data-reveal="fade">
              {site.contactEmail}
              <ArrowRight />
            </a>
          )}
        </div>

        <div className="ct-r" data-reveal="fade">
          <form className="form" onSubmit={onSubmit} noValidate aria-describedby={fid('status')}>
            <fieldset className="seg">
              <legend>문의 유형</legend>
              {(Object.keys(KIND_LABEL) as Kind[]).map((k) => (
                <label key={k}>
                  <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} />
                  {k === 'partnership' ? '협업 · 제휴' : '서비스 문의'}
                </label>
              ))}
            </fieldset>

            <div className="row2">
              <div className="field">
                <label htmlFor={fid('name')}>이름</label>
                <input id={fid('name')} name="name" type="text" autoComplete="name" required {...errProps('name')} />
                {errors.name && <span className="ferr" id={fid('name-err')}>{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor={fid('org')}>
                  소속 <span>(선택)</span>
                </label>
                <input id={fid('org')} name="organization" type="text" autoComplete="organization" />
              </div>
            </div>
            <div className="field">
              <label htmlFor={fid('email')}>이메일</label>
              <input id={fid('email')} name="email" type="email" autoComplete="email" inputMode="email" required {...errProps('email')} />
              {errors.email && <span className="ferr" id={fid('email-err')}>{errors.email}</span>}
            </div>
            <div className="field">
              <label htmlFor={fid('msg')}>문의 내용</label>
              <textarea id={fid('msg')} name="message" required {...errProps('message')} />
              {errors.message && <span className="ferr" id={fid('message-err')}>{errors.message}</span>}
            </div>
            <label className="agree">
              <input type="checkbox" name="agree" required {...errProps('agree')} />
              문의 응대를 위한 개인정보(이름, 이메일) 수집 · 이용에 동의합니다.
            </label>
            {errors.agree && <span className="ferr" id={fid('agree-err')}>{errors.agree}</span>}

            <button className="submit" type="submit" disabled={status === 'sending'}>
              <span>{status === 'sending' ? '보내는 중…' : '문의 보내기'}</span>
              <ArrowRight />
            </button>

            <div id={fid('status')} role="status" aria-live="polite">
              {status === 'unavailable' && (
                <p className="notice">
                  <InfoCircle />
                  <span>
                    아직 문의 전송 채널이 연결되지 않아 메시지가 전송되지 않았습니다.
                    {mailto && (
                      <>
                        {' '}
                        <a href={mailto}>이메일로 문의하기</a>
                      </>
                    )}
                  </span>
                </p>
              )}
              {status === 'error' && (
                <p className="notice err">
                  <InfoCircle />
                  <span>전송 중 문제가 발생해 문의가 전송되지 않았습니다. 잠시 후 다시 시도해주세요.</span>
                </p>
              )}
              {status === 'sent' && (
                <p className="notice">
                  <InfoCircle />
                  <span>문의가 전송되었습니다. 남겨주신 이메일로 답변드리겠습니다.</span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
