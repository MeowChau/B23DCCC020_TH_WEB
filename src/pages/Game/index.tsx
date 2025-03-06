import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, List, message } from 'antd';

const KeoImg = '/image/keo.png';
const BuaImg = '/image/bua.png';
const BaoImg = '/image/bao.png';

const choices = [
  { name: 'Kéo', img: KeoImg },
  { name: 'Búa', img: BuaImg },
  { name: 'Bao', img: BaoImg },
];

const getResult = (player: string, computer: string) => {
  if (player === computer) return 'Hòa';
  if (
    (player === 'Kéo' && computer === 'Bao') ||
    (player === 'Búa' && computer === 'Kéo') ||
    (player === 'Bao' && computer === 'Búa')
  ) {
    return 'Thắng';
  }
  return 'Thua';
};

const saveToLocalStorage = (history: { player: string; computer: string; result: string }[]) => 
  localStorage.setItem('gameHistory', JSON.stringify(history));

const loadFromLocalStorage = () => 
  JSON.parse(localStorage.getItem('gameHistory') || '[]');

const Game = () => {
  const [history, setHistory] = useState<{ player: string; computer: string; result: string }[]>([]);
  const [lastGame, setLastGame] = useState<{ player: string; computer: string; result: string } | null>(null);

  useEffect(() => {
    setHistory(loadFromLocalStorage());
  }, []);

  const playGame = (choice: string) => {
    const computer = choices[Math.floor(Math.random() * choices.length)].name;
    const gameResult = getResult(choice, computer);
    const newGame = { player: choice, computer, result: gameResult };
    const newHistory = [...history, newGame];

    setHistory(newHistory);
    setLastGame(newGame);
    saveToLocalStorage(newHistory);
    message.success(`Bạn chọn ${choice}, máy chọn ${computer}. Kết quả: ${gameResult}`);
  };

  const clearHistory = () => {
    setHistory([]);
    setLastGame(null);
    localStorage.removeItem('gameHistory');
    message.success('Đã xóa lịch sử!');
  };

  return (
    <PageContainer title="Game Kéo - Búa - Bao">
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          {choices.map((choice) => (
            <div 
              key={choice.name} 
              onClick={() => playGame(choice.name)} 
              style={{ 
                cursor: 'pointer', 
                textAlign: 'center',
                padding: 16,
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.2s',
                background: '#f0f0f0',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img src={choice.img} alt={choice.name} width={120} height={120} />
              <p style={{ fontSize: 24, fontWeight: 'bold', marginTop: 12 }}>{choice.name}</p>
            </div>
          ))}
        </div>
      </Card>

      {lastGame && (
        <Card title="Kết quả ván gần nhất" style={{ marginTop: 16, textAlign: 'center' }}>
          <p style={{ fontSize: 20, fontWeight: 'bold', color: lastGame.result === 'Thắng' ? 'green' : lastGame.result === 'Thua' ? 'red' : 'gray' }}>
            {lastGame.result}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <div>
              <img src={choices.find(c => c.name === lastGame.player)?.img || ''} alt={lastGame.player} width={80} height={80} />
              <p><strong>Bạn</strong></p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 'bold' }}>VS</p>
            <div>
              <img src={choices.find(c => c.name === lastGame.computer)?.img || ''} alt={lastGame.computer} width={80} height={80} />
              <p><strong>Máy</strong></p>
            </div>
          </div>
        </Card>
      )}

      <Card title="Lịch sử trận đấu" style={{ marginTop: 16 }}>
        <List
          dataSource={history}
          renderItem={(game, index) => (
            <List.Item key={index}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={choices.find(c => c.name === game.player)?.img || ''} alt={game.player} width={40} height={40} />
                <strong>Bạn:</strong> {game.player}
                <p style={{ margin: '0 10px' }}>VS</p>
                <img src={choices.find(c => c.name === game.computer)?.img || ''} alt={game.computer} width={40} height={40} />
                <strong>Máy:</strong> {game.computer}
                <p style={{ fontWeight: 'bold', marginLeft: 'auto', color: game.result === 'Thắng' ? 'green' : game.result === 'Thua' ? 'red' : 'gray' }}>
                  {game.result}
                </p>
              </div>
            </List.Item>
          )}
        />
        {history.length > 0 && (
          <button 
            onClick={clearHistory} 
            style={{ 
              marginTop: 10, 
              background: 'red', 
              color: 'white', 
              padding: '10px 15px', 
              border: 'none', 
              borderRadius: 6, 
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 'bold'
            }}
          >
            Xóa lịch sử
          </button>
        )}
      </Card>
    </PageContainer>
  );
};

export default Game;