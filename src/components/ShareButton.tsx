"use client";

import { useState } from "react";
import {
  copyShareLink,
  openLineShare,
  openThreadsShare,
  openXShare,
  shareWithDevice,
  withShareSource,
  type XShareData,
} from "@/lib/share";

function XIcon() {
  return (
    <svg className="x-share-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function ThreadsIcon() {
  return (
    <svg className="threads-share-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221Z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg className="line-share-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755Zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771Zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771Zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629ZM24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314Z" />
    </svg>
  );
}

function DeviceShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="18" cy="5" r="2.2" />
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="18" cy="19" r="2.2" />
      <path d="m8 11 7.8-4.6M8 13l7.8 4.6" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 13.8 8.4 15.4a3.4 3.4 0 0 1-4.8-4.8l3-3a3.4 3.4 0 0 1 4.8 0" />
      <path d="m14 10.2 1.6-1.6a3.4 3.4 0 0 1 4.8 4.8l-3 3a3.4 3.4 0 0 1-4.8 0" />
      <path d="m8.8 15.2 6.4-6.4" />
    </svg>
  );
}

export function ShareButton({ text, url }: XShareData) {
  return (
    <button
      type="button"
      className="action-button action-button--x-share"
      aria-label="Xで共有"
      title="Xで共有"
      onClick={() => openXShare({ text, url })}
    >
      <XIcon />
      <span>で共有</span>
    </button>
  );
}

export function ShareActions({ text, url }: XShareData) {
  const [feedback, setFeedback] = useState("");
  const xUrl = withShareSource(url, "x");
  const threadsUrl = withShareSource(url, "threads");
  const lineUrl = withShareSource(url, "line");
  const nativeUrl = withShareSource(url, "native");
  const copyUrl = withShareSource(url, "copy");

  async function handleDeviceShare() {
    try {
      const opened = await shareWithDevice({ text, url: nativeUrl });
      if (opened) {
        setFeedback("");
        return;
      }
      await copyShareLink(copyUrl);
      setFeedback("共有機能がないため、リンクをコピーしました");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setFeedback("共有できませんでした");
    }
  }

  async function handleCopy() {
    try {
      await copyShareLink(copyUrl);
      setFeedback("リンクをコピーしました");
    } catch {
      setFeedback("リンクをコピーできませんでした");
    }
  }

  return (
    <section className="share-actions" aria-label="結果を共有">
      <button
        type="button"
        className="action-button action-button--x-share"
        aria-label="Xで共有"
        title="Xで共有"
        onClick={() => openXShare({ text, url: xUrl })}
      >
        <XIcon />
        <span>で共有</span>
      </button>
      <div className="share-actions__row">
        <button
          type="button"
          className="action-button action-button--share-compact"
          aria-label="Threadsで共有"
          title="Threadsで共有"
          onClick={() => openThreadsShare({ text, url: threadsUrl })}
        >
          <span className="share-actions__icon share-actions__icon--threads">
            <ThreadsIcon />
          </span>
          <span>Threadsで共有</span>
        </button>
        <button
          type="button"
          className="action-button action-button--share-compact action-button--line"
          aria-label="LINEで送る"
          title="LINEで送る"
          onClick={() => openLineShare({ text, url: lineUrl })}
        >
          <span className="share-actions__icon share-actions__icon--line">
            <LineIcon />
          </span>
          <span>LINEで送る</span>
        </button>
      </div>
      <div className="share-actions__row share-actions__row--utility">
        <button
          type="button"
          className="action-button action-button--share-compact action-button--utility"
          aria-label="シェア先を選ぶ"
          title="シェア先を選ぶ"
          onClick={handleDeviceShare}
        >
          <span className="share-actions__icon share-actions__icon--utility">
            <DeviceShareIcon />
          </span>
          <span>シェア先を選ぶ</span>
        </button>
        <button
          type="button"
          className="action-button action-button--share-compact action-button--utility"
          aria-label="リンクをコピー"
          title="リンクをコピー"
          onClick={handleCopy}
        >
          <span className="share-actions__icon share-actions__icon--utility">
            <LinkIcon />
          </span>
          <span>リンクをコピー</span>
        </button>
      </div>
      <p className="share-actions__feedback" role="status" aria-live="polite">{feedback}</p>
    </section>
  );
}
