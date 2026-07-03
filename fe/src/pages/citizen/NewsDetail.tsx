import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { newsData } from '../../data/newsData';

interface Comment {
  id: string;
  name: string;
  avatar: string;
  text: string;
  time: string;
}

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useAppSelector((state) => state.ui);
  
  const newsItem = newsData.find((item) => item.id === id);

  // States
  const [likes, setLikes] = useState<number>(newsItem ? newsItem.likes : 0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [showShareSheet, setShowShareSheet] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Handle missing article
  useEffect(() => {
    if (!newsItem) {
      navigate('/dashboard', { replace: true });
    }
  }, [newsItem, navigate]);

  // Load likes & comments persistence
  useEffect(() => {
    if (!id) return;
    
    // Likes
    const liked = localStorage.getItem(`apgov_news_liked_${id}`);
    if (liked) {
      setHasLiked(true);
      setLikes((newsItem?.likes || 0) + 1);
    } else {
      setHasLiked(false);
      setLikes(newsItem?.likes || 0);
    }

    // Default mock comments based on article ID and language
    const getBaseComments = (): Comment[] => {
      if (language === 'te') {
        return [
          {
            id: 'c1',
            name: 'రవి కుమార్',
            avatar: 'RK',
            text: 'మా వార్డుకు ఇది చాలా ముఖ్యమైన ప్రాజెక్ట్. నిరంతర పర్యవేక్షణకు ఎమ్మెల్యే గారికి ధన్యవాదాలు.',
            time: '2 గంటల క్రితం',
          },
          {
            id: 'c2',
            name: 'శారద దేవి',
            avatar: 'SD',
            text: 'పనులు చాలా త్వరగా జరుగుతున్నాయి. నీటి కష్టాలు త్వరలోనే తీరుతాయి అని ఆశిస్తున్నాము.',
            time: '5 గంటల క్రితం',
          }
        ];
      } else {
        return [
          {
            id: 'c1',
            name: 'Ravi Kumar',
            avatar: 'RK',
            text: 'This is a very crucial project for our ward. Thank you to our MLA for constant monitoring.',
            time: '2 hours ago',
          },
          {
            id: 'c2',
            name: 'Sharada Devi',
            avatar: 'SD',
            text: 'The work is progressing very fast. Hoping our water issue gets resolved completely soon.',
            time: '5 hours ago',
          }
        ];
      }
    };

    // Load from localStorage or use defaults
    const storedComments = localStorage.getItem(`apgov_news_comments_${id}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    } else {
      const base = getBaseComments();
      setComments(base);
      localStorage.setItem(`apgov_news_comments_${id}`, JSON.stringify(base));
    }
  }, [id, language, newsItem]);

  if (!newsItem) {
    return null;
  }

  // Handle Like
  const handleLikeToggle = () => {
    if (!id) return;
    if (hasLiked) {
      localStorage.removeItem(`apgov_news_liked_${id}`);
      setLikes((prev) => prev - 1);
      setHasLiked(false);
      triggerToast(language === 'te' ? 'సంఘీభావం ఉపసంహరించుకోబడింది' : 'Removed support');
    } else {
      localStorage.setItem(`apgov_news_liked_${id}`, 'true');
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      triggerToast(language === 'te' ? 'మీరు ఈ ప్రాజెక్ట్‌కు సంఘీభావం తెలిపారు! ♥' : 'You supported this project! ♥');
    }
  };

  // Toast helper
  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 2000);
  };

  // Copy Link action
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://apgov.gov.in/news/${newsItem.id}`);
    setShowShareSheet(false);
    triggerToast(language === 'te' ? 'లింక్ కాపీ చేయబడింది!' : 'Link copied to clipboard!');
  };

  // Handle Post Comment
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      name: language === 'te' ? 'మీరు' : 'You',
      avatar: 'U',
      text: newCommentText.trim(),
      time: language === 'te' ? 'ఇప్పుడే' : 'Just now',
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`apgov_news_comments_${id}`, JSON.stringify(updated));
    setNewCommentText('');
    triggerToast(language === 'te' ? 'వ్యాఖ్య విజయవంతంగా జోడించబడింది!' : 'Comment posted successfully!');
  };



  // Recommended Articles (up to 3 other items)
  const recommendations = newsData
    .filter((item) => item.id !== newsItem.id)
    .slice(0, 3);

  const tLabels = {
    en: {
      budget: 'Budget',
      beneficiaries: 'Beneficiaries',
      scope: 'Scope',
      town: 'Town',
      projectProgress: 'Work Progress Tracker',
      mlaQuote: 'Statement from MLA Office',
      supportBtn: 'Support Project',
      shareBtn: 'Share Update',
      discussion: 'Citizen Discussion Board',
      writeCommentPlaceholder: 'Write a public comment...',
      postBtn: 'Post',
      noComments: 'Be the first to share your thoughts!',
      recommendTitle: 'Trending Community News',
      back: 'Back',
      copied: 'Copied!',
      shareHeading: 'Share this development update',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      twitter: 'Twitter',
      copyLink: 'Copy Link'
    },
    te: {
      budget: 'బడ్జెట్',
      beneficiaries: 'ప్రయోజనదారులు',
      scope: 'పరిధి',
      town: 'ప్రాంతం',
      projectProgress: 'పనుల పురోగతి సూచీ',
      mlaQuote: 'ఎమ్మెల్యే కార్యాలయం నుండి ప్రకటన',
      supportBtn: 'మద్దతు తెలపండి',
      shareBtn: 'షేర్ చేయండి',
      discussion: 'పౌరుల చర్చా వేదిక',
      writeCommentPlaceholder: 'మీ అభిప్రాయాన్ని రాయండి...',
      postBtn: 'జోడించు',
      noComments: 'మీ అభిప్రాయాన్ని పంచుకోండి!',
      recommendTitle: 'ట్రెండింగ్ కమ్యూనిటీ వార్తలు',
      back: 'వెనుకకు',
      copied: 'కాపీ చేయబడింది!',
      shareHeading: 'ఈ అభివృద్ధి వార్తను షేర్ చేయండి',
      whatsapp: 'వాట్సాప్',
      telegram: 'టెలిగ్రామ్',
      twitter: 'ట్విట్టర్',
      copyLink: 'లింక్ కాపీ చేయి'
    }
  };

  const l = tLabels[language];

  return (
    <div id="page-news-detail" style={{ background: '#f5f5f5', minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      
      {/* Floating Translucent Header */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255,255,255,0.25)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <i className="ti ti-arrow-left" style={{ fontSize: '18px' }} aria-hidden="true" />
        </button>

        <button 
          onClick={() => setShowShareSheet(true)}
          style={{
            background: 'rgba(255,255,255,0.25)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <i className="ti ti-share" style={{ fontSize: '18px' }} aria-hidden="true" />
        </button>
      </div>

      {/* Hero Banner Section */}
      <div 
        style={{
          height: '240px',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: '#ddd',
        }}
      >
        <img 
          src={newsItem.image} 
          alt={newsItem.title.en}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Dark Scrim overlay */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
          }}
        />
        {/* Category Badge & Headline overlay */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            color: '#fff',
          }}
        >
          <span 
            style={{
              background: newsItem.accentColor,
              color: '#fff',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'inline-block',
              marginBottom: '8px',
            }}
          >
            {language === 'te' ? newsItem.category.te : newsItem.category.en}
          </span>
          <h1 
            style={{
              fontSize: '16px',
              fontWeight: '700',
              lineHeight: '1.4',
              color: '#ffffff',
              margin: '0 0 6px',
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
          >
            {language === 'te' ? newsItem.title.te : newsItem.title.en}
          </h1>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '10.5px',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <span>
              <i className="ti ti-clock" aria-hidden="true" style={{ marginRight: '3px' }} />
              {language === 'te' ? newsItem.date.te : newsItem.date.en}
            </span>
            <span>·</span>
            <span>{newsItem.readTime}</span>
            <span>·</span>
            <span>{newsItem.views}</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div 
        style={{
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          flex: 1,
        }}
      >


        {/* Written Article Body */}
        <div 
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: '16px',
            padding: '14px',
            color: '#333',
            fontSize: '12.5px',
            lineHeight: '1.6',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {newsItem.content[language].map((paragraph, index) => (
            <p key={index} style={{ margin: 0 }}>
              {paragraph}
            </p>
          ))}

          {/* Blockquote from MLA Office */}
          <div 
            style={{
              borderLeft: '4px solid #CC9900',
              background: '#fffbf0',
              padding: '12px',
              borderRadius: '0 12px 12px 0',
              marginTop: '6px',
            }}
          >
            <div style={{ fontSize: '10px', color: '#CC9900', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
              {l.mlaQuote}
            </div>
            <p style={{ margin: 0, fontStyle: 'italic', color: '#665c00', fontSize: '12px' }}>
              {newsItem.quote.text[language]}
            </p>
            <div style={{ fontSize: '9.5px', color: '#999', marginTop: '6px', fontWeight: '700', textAlign: 'right' }}>
              — {newsItem.quote.author[language]}
            </div>
          </div>
        </div>

        {/* Support & Share Actions Row */}
        <div 
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          {/* Support project button */}
          <button 
            onClick={handleLikeToggle}
            style={{
              flex: 1.3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: hasLiked ? 'rgba(239, 68, 68, 0.08)' : '#ffffff',
              border: hasLiked ? '1.5px solid rgba(239, 68, 68, 0.4)' : '1.5px solid rgba(0,0,0,0.1)',
              borderRadius: '14px',
              padding: '12px',
              fontSize: '12px',
              fontWeight: '700',
              color: hasLiked ? '#ef4444' : '#555',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
              fontFamily: 'inherit',
            }}
          >
            <i className={hasLiked ? 'ti ti-heart-filled' : 'ti ti-heart'} style={{ fontSize: '15px' }} aria-hidden="true" />
            {l.supportBtn} ({likes})
          </button>

          {/* Share Update */}
          <button 
            onClick={() => setShowShareSheet(true)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: '#ffffff',
              border: '1.5px solid rgba(0,0,0,0.1)',
              borderRadius: '14px',
              padding: '12px',
              fontSize: '12px',
              fontWeight: '700',
              color: '#555',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
              fontFamily: 'inherit',
            }}
          >
            <i className="ti ti-share" style={{ fontSize: '15px' }} aria-hidden="true" />
            {l.shareBtn}
          </button>
        </div>

        {/* Discussion / Comments Section */}
        <div 
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: '16px',
            padding: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <h2 style={{ fontSize: '12px', fontWeight: '800', color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
            {l.discussion}
          </h2>

          {/* Comment submission form */}
          <form onSubmit={handlePostComment} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input 
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder={l.writeCommentPlaceholder}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #e5e7eb',
                fontSize: '12px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button 
              type="submit"
              style={{
                background: '#CC9900',
                border: 'none',
                borderRadius: '12px',
                padding: '0 16px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {l.postBtn}
            </button>
          </form>

          {/* Comments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '11px', color: '#999' }}>
                {l.noComments}
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div 
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#eaeaea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10.5px',
                      fontWeight: '800',
                      color: '#666',
                    }}
                  >
                    {comment.avatar}
                  </div>
                  <div style={{ flex: 1, background: '#f9f9f9', borderRadius: '12px', padding: '8px 10px', border: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#333' }}>{comment.name}</span>
                      <span style={{ fontSize: '8.5px', color: '#aaa' }}>{comment.time}</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#444', lineHeight: '1.4' }}>{comment.text}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recommended articles carousel */}
        <div style={{ marginTop: '4px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: '800', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px', paddingLeft: '2px' }}>
            {l.recommendTitle}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recommendations.map((item) => (
              <div 
                key={item.id} 
                className="nc" 
                onClick={() => {
                  navigate(`/news/${item.id}`);
                  window.scrollTo(0, 0);
                }}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: '14px',
                  padding: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#fffde7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <i className={item.icon} style={{ color: '#CC9900', fontSize: '16px' }} aria-hidden="true" />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '9px', fontWeight: '800', color: '#CC9900', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {language === 'te' ? item.category.te : item.category.en}
                  </div>
                  <div 
                    style={{
                      fontSize: '11.5px',
                      fontWeight: '700',
                      color: '#222',
                      lineHeight: '1.3',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '220px',
                    }}
                  >
                    {language === 'te' ? item.title.te : item.title.en}
                  </div>
                </div>
                <i className="ti ti-chevron-right" style={{ color: '#ccc', fontSize: '14px' }} aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>

        {/* Space for Bottom Nav spacing */}
        <div style={{ height: '40px' }} />
      </div>

      {/* Floating Action Notifications Toast */}
      {showToast && (
        <div 
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(17,17,17,0.92)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontWeight: '700',
            zIndex: 100,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            textAlign: 'center',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            animation: 'fadeInUp 0.2s ease',
          }}
        >
          {showToast}
        </div>
      )}

      {/* Slide-up Native Share Sheet Drawer */}
      {showShareSheet && (
        <>
          {/* Backdrop click close */}
          <div 
            onClick={() => setShowShareSheet(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 90,
              animation: 'fadeIn 0.2s ease',
            }}
          />

          {/* Share sheet body */}
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: '#ffffff',
              borderRadius: '24px 24px 0 0',
              padding: '18px 18px 30px',
              zIndex: 95,
              animation: 'slideUp 0.25s cubic-bezier(0.1, 0.76, 0.55, 0.94)',
              boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
            }}
          >
            {/* Grab Bar */}
            <div 
              style={{
                width: '36px',
                height: '4px',
                background: '#e5e7eb',
                borderRadius: '2px',
                margin: '0 auto 16px',
              }}
            />

            <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', margin: '0 0 16px' }}>
              {l.shareHeading}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', textAlign: 'center' }}>
              <div onClick={handleCopyLink} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
                  <i className="ti ti-copy" style={{ fontSize: '20px' }} aria-hidden="true" />
                </div>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#4b5563' }}>{l.copyLink}</span>
              </div>

              <div onClick={() => { setShowShareSheet(false); triggerToast(l.copied); }} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32' }}>
                  <i className="ti ti-brand-whatsapp" style={{ fontSize: '20px' }} aria-hidden="true" />
                </div>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#4b5563' }}>{l.whatsapp}</span>
              </div>

              <div onClick={() => { setShowShareSheet(false); triggerToast(l.copied); }} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#e1f5fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0288d1' }}>
                  <i className="ti ti-brand-telegram" style={{ fontSize: '20px' }} aria-hidden="true" />
                </div>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#4b5563' }}>{l.telegram}</span>
              </div>

              <div onClick={() => { setShowShareSheet(false); triggerToast(l.copied); }} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#eceff1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#37474f' }}>
                  <i className="ti ti-brand-twitter" style={{ fontSize: '20px' }} aria-hidden="true" />
                </div>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#4b5563' }}>{l.twitter}</span>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default NewsDetail;
