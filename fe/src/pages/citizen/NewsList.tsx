import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { translations } from '../../i18n/translations';
import { newsData } from '../../data/newsData';

const NewsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useAppSelector((state) => state.ui);
  const t = translations[language];

  // Read initial scope from query parameter or default to 'village'
  const initialScope = (searchParams.get('scope') === 'constituency' ? 'constituency' : 'village') as 'village' | 'constituency';
  const [scope, setScope] = useState<'village' | 'constituency'>(initialScope);
  // Keep state and URL query params in sync
  useEffect(() => {
    setSearchParams({ scope });
  }, [scope, setSearchParams]);

  // Sync state if URL query param changes externally
  useEffect(() => {
    const queryScope = searchParams.get('scope');
    if (queryScope === 'constituency' || queryScope === 'village') {
      setScope(queryScope as 'village' | 'constituency');
    }
  }, [searchParams]);

  // Filtering news items based on scope
  const filteredNews = newsData.filter((item) => {
    return item.scope === scope;
  });

  return (
    <div id="page-news-list" style={{ background: '#f5f5f5', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Bar */}
      <div 
        style={{
          background: '#ffffff',
          padding: '16px 14px 10px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: '#111',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <i className="ti ti-arrow-left" style={{ fontSize: '20px' }} aria-hidden="true" />
        </button>
        <span style={{ fontSize: '15px', fontWeight: '800', color: '#111' }}>
          {t.communityUpdatesHeader}
        </span>
      </div>

      {/* Main Container */}
      <div style={{ padding: '12px 14px 30px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        
        {/* Scope Selector Tabs */}
        <div className="tog-wrap" style={{ margin: '0' }}>
          <div className="tog-pill" style={{ background: 'rgba(0,0,0,0.04)' }}>
            <button 
              className={`tog-b ${scope === 'village' ? 'on' : ''}`} 
              onClick={() => setScope('village')}
              style={{ padding: '8px 12px', fontSize: '11.5px' }}
            >
              {language === 'te' ? 'మీ గ్రామం' : 'Your Village'}
            </button>
            <button 
              className={`tog-b ${scope === 'constituency' ? 'on' : ''}`} 
              onClick={() => setScope('constituency')}
              style={{ padding: '8px 12px', fontSize: '11.5px' }}
            >
              {language === 'te' ? 'নিయోజকవర్గం' : 'Constituency'}
            </button>
          </div>
        </div>

        {/* News Feed List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          {filteredNews.length === 0 ? (
            <div 
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '16px',
                padding: '30px 20px',
                textAlign: 'center',
                color: '#888',
                fontSize: '12px',
              }}
            >
              <i className="ti ti-news-off" style={{ fontSize: '28px', color: '#ccc', marginBottom: '8px', display: 'block' }} aria-hidden="true" />
              {t.noNewsFound}
            </div>
          ) : (
            filteredNews.map((item, idx) => (
              <div 
                key={item.id} 
                className={`nc d${1 + idx}`} 
                onClick={() => navigate(`/news/${item.id}`)}
                style={{ marginBottom: 0 }}
              >
                {/* Standardized Gold Accent Border */}
                <div className="nc-accent" style={{ background: '#CC9900' }}></div>
                <div className="nc-inner" style={{ padding: '12px 14px' }}>
                  
                  {/* Left Side: Thumbnail Preview */}
                  <img 
                    src={item.image} 
                    alt={item.title.en}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      flexShrink: 0,
                      background: '#eee',
                      border: '1px solid rgba(0,0,0,0.04)',
                    }}
                  />

                  {/* Right Side: Metadata, Title, Sub-details */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '9px', fontWeight: '800', color: '#CC9900', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        {language === 'te' ? item.category.te : item.category.en}
                      </span>
                      <span style={{ fontSize: '9px', color: '#aaa' }}>{item.readTime}</span>
                    </div>

                    <h3 
                      style={{
                        fontSize: '12.5px',
                        fontWeight: '700',
                        color: '#111',
                        lineHeight: '1.4',
                        margin: '2px 0 4px',
                        textAlign: 'left',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {language === 'te' ? item.title.te : item.title.en}
                    </h3>

                    <div className="nc-meta" style={{ marginTop: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        <i className="ti ti-map-pin" aria-hidden="true" style={{ fontSize: '10px', marginRight: '2px' }} />
                        {language === 'te' ? item.location.te : item.location.en}
                      </span>
                      <span style={{ fontSize: '9px', color: '#bbb' }}>
                        {language === 'te' ? item.date.te : item.date.en}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Floating bottom spacing */}
        <div style={{ height: '40px' }} />
      </div>

    </div>
  );
};

export default NewsList;
