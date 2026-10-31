'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
export default function ContactForm() {
  const [s, setS] = useState({ state: 'idle' });
  async function submit(e) {
    e.preventDefault();
    const form = e.target;
    const f = new FormData(form);
    if (f.get('website')) return; // honeypot
    setS({ state: 'sending' });
    const { error } = await supabase.from('messages').insert({
      name: f.get('name'), email: f.get('email'), service: f.get('service'), message: f.get('message') });
    if (error) setS({ state: 'err' }); else { form.reset(); setS({ state: 'ok' }); }
  }
  return (
    <form className="f" onSubmit={submit}>
      <input name="name" placeholder="Your name" required maxLength={100} />
      <input name="email" type="email" placeholder="Your email" required maxLength={200} />
      <select name="service" defaultValue="">
        <option value="">Service needed (optional)</option>
        <option>AI Product Images</option><option>Food Product Ads</option>
        <option>Cinematic AI Video Ad</option><option>Commercial Video Editing</option>
      </select>
      <textarea name="message" rows={5} placeholder="Tell me about your project" required minLength={5} maxLength={3000} />
      <input name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
      <button className="btn" disabled={s.state === 'sending'}>{s.state === 'sending' ? 'Sending…' : 'Send message'}</button>
      {s.state === 'ok' && <span className="ok">Thanks! Your message was sent.</span>}
      {s.state === 'err' && <span className="err">Could not send. Please use one of the contact buttons instead.</span>}
    </form>);
}
