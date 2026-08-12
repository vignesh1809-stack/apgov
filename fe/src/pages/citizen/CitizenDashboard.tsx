import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { setNewIssueModalOpen } from '../../store/uiSlice';
import { newsData } from '../../data/newsData';

import { fetchCitizenStats, fetchCitizenGrievances } from '../../store/citizenSlice';

const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { stats, grievances: liveCitizenGrievances } = useAppSelector((state) => state.citizen);
  const { list: fallbackIssues } = useAppSelector((state) => state.issues);
  const { language } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  React.useEffect(() => {
    dispatch(fetchCitizenStats());
    dispatch(fetchCitizenGrievances());
  }, [dispatch]);

  const feedTranslations = {
    en: {
      fromMlaOffice: 'From MLA Office',
      pinned: 'Pinned',
      villageNews: 'Village News',
      constituencyNews: 'Constituency News',
      seeAll: 'See all →',
      mlaName: 'Sri Chandrababu Naidu',
      mlaMsg: '"Water supply restoration work in Kuppam Town will be completed by Thursday. Transformer upgrade at Ward 4 also in progress. Thank you for your patience."',
      twoHoursAgo: '2 hours ago',
      threeHoursAgo: '3 hours ago',
      fourHoursAgo: '4 hours ago',
      yesterday: 'Yesterday',
      twoDaysAgo: '2 days ago',
      threeDaysAgo: '3 days ago',
      new: 'NEW',

      // Village news titles
      elecTag: 'Electricity',
      elecTitle: 'Transformer replacement at Ward 4 tomorrow 9 am — 1 pm power cut',
      waterTag: 'Water',
      waterTitle: 'Borewell repair at Ward 4 completed — normal supply restored from today',
      roadsTag: 'Roads',
      roadsTitle: 'Pothole patching on Main Street begins Monday — expect minor delays',
      healthTag: 'Health',
      healthTitle: 'PHC dengue awareness drive this Saturday morning at your ward',

      // Constituency news titles
      infraTag: 'Infrastructure',
      infraTitle: 'NH-40 bypass road repair begins — completion expected in 2 weeks',
      healthCampTitle: 'Free health camp at Ramakuppam PHC this Saturday — all residents welcome',
      schoolTag: 'Education',
      schoolTitle: 'New classrooms inaugurated at Gudupalli Govt School — 120 students benefit',
      devTag: 'Development',
      devTitle: 'MLA inaugurates new Panchayat office at Venkatagirikota mandal',

      // Stats Labels
      total: 'Total',
      resolved: 'Resolved',
      pending: 'Pending',
      rate: 'Rate',
      rank: 'Rank #1',
      urgent: 'urgent',
      today: 'today',
      week: 'week',

      // Quick Action Labels
      raise: 'Raise Issue',
      myIssues: 'My Issues',
      track: 'Track',
      mlaOffice: 'MLA Office',
      profile: 'Profile',
      announcements: 'Announcements',
      yourVillageStats: 'Your Village Stats',
    },
    te: {
      fromMlaOffice: 'ఎమ్మెల్యే కార్యాలయం నుండి',
      pinned: 'పినెడ్',
      villageNews: 'గ్రామ వార్తలు',
      constituencyNews: 'నియోజకవర్గ వార్తలు',
      seeAll: 'అన్నీ చూడండి →',
      mlaName: 'శ్రీ చంద్రబాబు నాయుడు',
      mlaMsg: '"కుప్పం టౌన్‌లో తాగునీటి సరఫరా పునరుద్ధరణ పనులు గురువారానికి పూర్తవుతాయి. వార్డు 4లో ట్రాన్స్‌ఫార్మర్ అప్‌గ్రేడ్ పనులు కూడా జరుగుతున్నాయి. మీ ఓపికకు ధన్యవాదాలు."',
      twoHoursAgo: '2 గంటల క్రితం',
      threeHoursAgo: '3 గంటల క్రితం',
      fourHoursAgo: '4 గంటల క్రితం',
      yesterday: 'నిన్న',
      twoDaysAgo: '2 రోజుల క్రితం',
      threeDaysAgo: '3 రోజుల క్రితం',
      new: 'కొత్తది',

      // Village news titles
      elecTag: 'విద్యుత్',
      elecTitle: 'రేపు వార్డు 4లో ట్రాన్స్‌ఫార్మర్ మార్పిడి — ఉదయం 9 నుండి మధ్యాహ్నం 1 గంటల వరకు విద్యుత్ సరఫరా నిలిపివేత',
      waterTag: 'నీరు',
      waterTitle: 'వార్డు 4లో బోర్‌వెల్ మరమ్మతు పూర్తి — నేటి నుండి సాధారణ సరఫరా పునరుద్ధరణ',
      roadsTag: 'రహదారులు',
      roadsTitle: 'సోమవారం నుండి మెయిన్ స్ట్రీట్‌లో గుంతల మరమ్మతులు ప్రారంభం — స్వల్ప ఆలస్యం ఉండవచ్చు',
      healthTag: 'ఆరోగ్యం',
      healthTitle: 'ఈ శనివారం ఉదయం మీ వార్డులో పీహెచ్‌సీ డెంగ్యూ అవగాహన కార్యక్రమం',

      // Constituency news titles
      infraTag: 'మౌలిక సదుపాయాలు',
      infraTitle: 'ఎన్‌హెచ్-40 బైపాస్ రోడ్డు మరమ్మతులు ప్రారంభం — 2 వారాల్లో పూర్తి కావచ్చు',
      healthCampTitle: 'ఈ శనివారం రామకుప్పం పీహెచ్‌సీలో ఉచిత ఆరోగ్య శిబిరం — ప్రజలందరికీ ఆహ్వానం',
      schoolTag: 'విద్య',
      schoolTitle: 'గుడుపల్లి ప్రభుత్వ పాఠశాలలో కొత్త తరగతి గదుల ప్రారంభం — 120 మంది విద్యార్థులకు లబ్ధి',
      devTag: 'అభివృద్ధి',
      devTitle: 'వెంకటగిరికోట మండలంలో కొత్త పంచాయతీ కార్యాలయాన్ని ప్రారంభించిన ఎమ్మెల్యే',

      // Stats Labels
      total: 'మొత్తం',
      resolved: 'పరిష్కరించబడినవి',
      pending: 'పెండింగ్',
      rate: 'పరిష్కార రేటు',
      rank: 'ర్యాంక్ #1',
      urgent: 'అవసరం',
      today: 'ఈరోజు',
      week: 'వారం',

      // Quick Action Labels
      raise: 'సమస్య నమోదు',
      myIssues: 'నా సమస్యలు',
      track: 'ట్రాక్',
      mlaOffice: 'ఎమ్మెల్యే ఆఫీస్',
      profile: 'ప్రొఫైల్',
      announcements: 'ప్రకటనలు',
      yourVillageStats: 'మీ గ్రామ గణాంకాలు',
    }
  };

  const ft = feedTranslations[language];

  const citizenIssues = liveCitizenGrievances && liveCitizenGrievances.length > 0
    ? liveCitizenGrievances
    : fallbackIssues.filter(i => i.reporter === user?.name);
  const myIssuesCount = stats ? stats.myIssuesCount : citizenIssues.length;

  const dynamicTotal = stats ? stats.total : (300 + fallbackIssues.length);
  const dynamicResolved = stats ? stats.resolved : (278 + fallbackIssues.filter(i => i.status === 'Resolved').length);
  const dynamicPending = stats ? stats.pending : (dynamicTotal - dynamicResolved);
  const dynamicRate = stats ? Math.round(stats.resolutionRate) : Math.round((dynamicResolved / dynamicTotal) * 100);

  const [scope, setScope] = React.useState<'village' | 'constituency'>('constituency');

  return (
    <div id="page-citizen-dashboard" style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      position: 'relative'
    }}>
      {/* Quick Actions Row */}
      <div className="qa-row d2" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
        {/* Raise Issue */}
        <div className="qa" onClick={() => {
          dispatch(setNewIssueModalOpen(true));
          navigate('/issues?tab=raise');
        }}>
          <div className="qa-ico" style={{ background: '#fffde7' }}>
            <i className="ti ti-circle-plus" aria-hidden="true" style={{ color: '#CC9900' }}></i>
          </div>
          <div className="qa-lbl">{ft.raise}</div>
        </div>

        {/* My Issues */}
        <div className="qa" onClick={() => navigate('/issues?tab=my')}>
          <div className="qa-ico" style={{ background: '#f0fdf4', position: 'relative' }}>
            <i className="ti ti-clipboard-list" aria-hidden="true" style={{ color: '#16a34a' }}></i>
            {myIssuesCount > 0 && <div className="qa-badge">{myIssuesCount}</div>}
          </div>
          <div className="qa-lbl">{ft.myIssues}</div>
        </div>

        {/* Track */}
        <div className="qa" onClick={() => navigate('/issues?tab=track')}>
          <div className="qa-ico" style={{ background: '#eff6ff' }}>
            <i className="ti ti-map-search" aria-hidden="true" style={{ color: '#3b82f6' }}></i>
          </div>
          <div className="qa-lbl">{ft.track}</div>
        </div>

        {/* MLA Office */}
        <div className="qa" onClick={() => navigate('/mla-office')}>
          <div className="qa-ico" style={{ background: '#fef2f2' }}>
            <i className="ti ti-phone" aria-hidden="true" style={{ color: '#dc2626' }}></i>
          </div>
          <div className="qa-lbl">{ft.mlaOffice}</div>
        </div>

        {/* Profile */}
        <div className="qa" onClick={() => navigate('/profile')}>
          <div className="qa-ico" style={{ background: '#faf5ff' }}>
            <i className="ti ti-user" aria-hidden="true" style={{ color: '#9333ea' }}></i>
          </div>
          <div className="qa-lbl">{ft.profile}</div>
        </div>
      </div>

      <div className="sec-hdr d3">
        <div className="sec-left">
          <div className="sec-bar"></div>
          <div className="sec-ttl">{ft.yourVillageStats}</div>
        </div>
      </div>

      <div className="stats-strip d3">
        <div className="ss">
          <div className="ss-n" style={{ color: '#111' }}>{dynamicTotal}</div>
          <div className="ss-l">{ft.total}</div>
        </div>
        <div className="ss">
          <div className="ss-n" style={{ color: '#16a34a' }}>{dynamicResolved}</div>
          <div className="ss-l">{ft.resolved}</div>
        </div>
        <div className="ss">
          <div className="ss-n" style={{ color: '#dc2626' }}>{dynamicPending}</div>
          <div className="ss-l">{ft.pending}</div>
        </div>
        <div className="ss">
          <div className="ss-n" style={{ color: '#CC9900' }}>{dynamicRate}%</div>
          <div className="ss-l">{ft.rate}</div>
        </div>
      </div>

      {/* Feed Switcher */}
      <div className="tog-wrap d4">
        <div className="tog-pill">
          <button className={`tog-b ${scope === 'village' ? 'on' : ''}`} onClick={() => setScope('village')}>
            {language === 'te' ? 'మీ గ్రామం' : 'Your Village'}
          </button>
          <button className={`tog-b ${scope === 'constituency' ? 'on' : ''}`} onClick={() => setScope('constituency')}>
            {language === 'te' ? 'నియోజకవర్గం' : 'Constituency'}
          </button>
        </div>
      </div>

      {/* Feeds */}
      {scope === 'village' ? (
        <div id="fv" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="sec-hdr d4">
            <div className="sec-left">
              <div className="sec-bar"></div>
              <div className="sec-ttl">{ft.fromMlaOffice}</div>
            </div>
            <span className="sec-cnt">{ft.pinned}</span>
          </div>

          <div className="mla-card d5">
            <div className="mla-av">CB</div>
            <div>
              <div className="mla-nm">Sri Chandrababu Naidu <span className="mla-chip">MLA</span></div>
              <div className="mla-msg">{ft.mlaMsg}</div>
              <div className="mla-time"><i className="ti ti-clock" aria-hidden="true"></i>{ft.twoHoursAgo}</div>
            </div>
          </div>

          <div className="sec-hdr d5">
            <div className="sec-left">
              <div className="sec-bar"></div>
              <div className="sec-ttl">{ft.villageNews}</div>
            </div>
            <button className="see-all-btn" onClick={() => navigate('/news?scope=village')}>{ft.seeAll}</button>
          </div>

          {newsData.filter(item => item.scope === 'village').map((item, idx) => (
            <div key={item.id} className={`nc d${5 + idx}`} onClick={() => navigate(`/news/${item.id}`)}>
              <div className="nc-accent" style={{ background: '#CC9900' }}></div>
              <div className="nc-inner">
                <div className="nc-ico" style={{ background: '#fffde7' }}>
                  <i className={item.icon} aria-hidden="true" style={{ color: '#CC9900' }}></i>
                </div>
                <div>
                  <div className="nc-tag" style={{ color: '#CC9900' }}>{language === 'te' ? item.category.te : item.category.en}</div>
                  <div className="nc-title">{language === 'te' ? item.title.te : item.title.en}</div>
                  <div className="nc-meta">
                    <i className="ti ti-clock" aria-hidden="true"></i>
                    {language === 'te' ? item.date.te : item.date.en} · {language === 'te' ? item.location.te : item.location.en} {idx === 0 && <span className="nc-new">{language === 'te' ? 'కొత్తది' : 'NEW'}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div id="fc" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="sec-hdr d4">
            <div className="sec-left">
              <div className="sec-bar"></div>
              <div className="sec-ttl">{ft.constituencyNews}</div>
            </div>
            <button className="see-all-btn" onClick={() => navigate('/news?scope=constituency')}>{ft.seeAll}</button>
          </div>

          {newsData.filter(item => item.scope === 'constituency').map((item, idx) => (
            <div key={item.id} className={`nc d${5 + idx}`} onClick={() => navigate(`/news/${item.id}`)}>
              <div className="nc-accent" style={{ background: '#CC9900' }}></div>
              <div className="nc-inner">
                <div className="nc-ico" style={{ background: '#fffde7' }}>
                  <i className={item.icon} aria-hidden="true" style={{ color: '#CC9900' }}></i>
                </div>
                <div>
                  <div className="nc-tag" style={{ color: '#CC9900' }}>{language === 'te' ? item.category.te : item.category.en}</div>
                  <div className="nc-title">{language === 'te' ? item.title.te : item.title.en}</div>
                  <div className="nc-meta">
                    <i className="ti ti-clock" aria-hidden="true"></i>
                    {language === 'te' ? item.date.te : item.date.en} · {language === 'te' ? item.location.te : item.location.en}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ height: '8px' }} />
    </div>
  );
};

export default CitizenDashboard;
