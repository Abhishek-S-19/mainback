import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../utils/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './ScoreBoard.css';

const OUT_TYPES = {
  BOWLED: 'Bowled',
  CAUGHT: 'Caught',
  LBW: 'LBW',
  RUN_OUT: 'Run Out',
  STUMPED: 'Stumped',
  NOT_OUT: 'Not Out'
};

const ScoreBoard = ({ match }) => {
  const [currentInning, setCurrentInning] = useState(1);
  const [batter1, setBatter1] = useState({});
  const [batter2, setBatter2] = useState({});
  const [bowler, setBowler] = useState({});
  const [currentRunStack, setCurrentRunStack] = useState([]);
  const [totalRuns, setTotalRuns] = useState(0);
  const [wicketCount, setWicketCount] = useState(0);
  const [totalOvers, setTotalOvers] = useState(0);
  const [ballCount, setBallCount] = useState(0);
  const [overCount, setOverCount] = useState(0);
  const [extras, setExtras] = useState({ total: 0, wide: 0, noBall: 0 });
  const [runsByOver, setRunsByOver] = useState(0);
  const [recentOvers, setRecentOvers] = useState([]);
  const [isNoBall, setIsNoBall] = useState(false);
  const [openOutDialog, setOpenOutDialog] = useState(false);
  const [outType, setOutType] = useState('');
  const [runOutPlayerId, setRunOutPlayerId] = useState('');
  const [strikeValue, setStrikeValue] = useState('strike');
  const [batters, setBatters] = useState([]);
  const [bowlers, setBowlers] = useState([]);
  const [matchData, setMatchData] = useState({
    inning1: { batters: [], bowlers: [], runs: 0, wickets: 0, overs: 0 },
    inning2: { batters: [], bowlers: [], runs: 0, wickets: 0, overs: 0 }
  });

  useEffect(() => {
    if (match) {
      fetchMatchScores();
    }
  }, [match]);

  const fetchMatchScores = async () => {
    try {
      const response = await api.get(`/scores/match/${match._id}`);
      const scores = response.data;
      
      // Process scores into innings data
      const inning1Scores = scores.filter(score => score.inning === 1);
      const inning2Scores = scores.filter(score => score.inning === 2);
      
      setMatchData({
        inning1: processInningScores(inning1Scores),
        inning2: processInningScores(inning2Scores)
      });
    } catch (error) {
      toast.error('Failed to fetch match scores');
    }
  };

  const processInningScores = (scores) => {
    const batters = [];
    const bowlers = [];
    let totalRuns = 0;
    let totalWickets = 0;
    let totalOvers = 0;

    scores.forEach(score => {
      // Process batting
      batters.push({
        id: score.player._id,
        name: score.player.name,
        run: score.batting.runs,
        ball: score.batting.balls,
        four: score.batting.fours,
        six: score.batting.sixes,
        strikeRate: score.batting.strikeRate,
        out: score.batting.out,
        dismissalType: score.batting.dismissalType
      });

      // Process bowling
      bowlers.push({
        id: score.player._id,
        name: score.player.name,
        over: score.bowling.overs,
        maiden: score.bowling.maidens,
        run: score.bowling.runs,
        wicket: score.bowling.wickets,
        noBall: score.bowling.noBalls,
        wide: score.bowling.wides,
        economy: score.bowling.economy
      });

      totalRuns += score.batting.runs;
      if (score.batting.out) totalWickets++;
      totalOvers = Math.max(totalOvers, score.bowling.overs);
    });

    return {
      batters,
      bowlers,
      runs: totalRuns,
      wickets: totalWickets,
      overs: totalOvers
    };
  };

  const handleRun = (run) => {
    if (isNoBall) {
      setCurrentRunStack([...currentRunStack, `nb${run}`]);
      setIsNoBall(false);
    } else {
      setBallCount(ballCount + 1);
      setCurrentRunStack([...currentRunStack, run]);
    }

    setTotalRuns(totalRuns + run);
    setRunsByOver(runsByOver + run);

    if (ballCount === 5) {
      if (isNoBall) {
        if (run % 2 !== 0) {
          changeStrike();
        }
      } else {
        setTotalOvers(overCount + 1);
        const arr = [...currentRunStack, run];
        overCompleted(runsByOver + run, arr);
        if (run % 2 === 0) {
          changeStrike();
        }
      }
    } else {
      if (!isNoBall) {
        setTotalOvers(Math.round((totalOvers + 0.1) * 10) / 10);
      }
      if (run % 2 !== 0) {
        changeStrike();
      }
    }

    updateBatterStats(run);
  };

  const handleWicket = () => {
    setOpenOutDialog(true);
  };

  const handleOutTypeSelect = (type) => {
    setOutType(type);
    if (type === OUT_TYPES.RUN_OUT) {
      // Show run out player selection
    } else {
      processWicket(type);
    }
  };

  const processWicket = (type) => {
    setWicketCount(wicketCount + 1);
    setBallCount(ballCount + 1);
    setCurrentRunStack([...currentRunStack, 'W']);
    
    if (ballCount === 5) {
      setTotalOvers(overCount + 1);
      const arr = [...currentRunStack, 'W'];
      overCompleted(runsByOver, arr);
    } else {
      setTotalOvers(Math.round((totalOvers + 0.1) * 10) / 10);
    }

    // Update batter stats
    if (strikeValue === 'strike') {
      setBatter1({ ...batter1, out: true, dismissalType: type });
    } else {
      setBatter2({ ...batter2, out: true, dismissalType: type });
    }

    setOpenOutDialog(false);
  };

  const handleNoBall = () => {
    setTotalRuns(totalRuns + 1);
    setRunsByOver(runsByOver + 1);
    setExtras({
      ...extras,
      total: extras.total + 1,
      noBall: extras.noBall + 1
    });
    setIsNoBall(true);
  };

  const handleWide = () => {
    if (isNoBall) {
      setCurrentRunStack([...currentRunStack, 'nb']);
      setIsNoBall(false);
    } else {
      setCurrentRunStack([...currentRunStack, 'wd']);
      setTotalRuns(totalRuns + 1);
      setRunsByOver(runsByOver + 1);
      setExtras({
        ...extras,
        total: extras.total + 1,
        wide: extras.wide + 1
      });
    }
  };

  const overCompleted = (runs, stack) => {
    setRecentOvers([
      ...recentOvers,
      { overNo: overCount + 1, bowler: bowler.name, runs, stack }
    ]);
    setCurrentRunStack([]);
    setRunsByOver(0);
    setBallCount(0);
    setOverCount(overCount + 1);
    updateBowlerStats(runs, stack);
  };

  const updateBatterStats = (run) => {
    const batter = strikeValue === 'strike' ? batter1 : batter2;
    const updatedBatter = {
      ...batter,
      run: batter.run + run,
      ball: batter.ball + 1,
      four: run === 4 ? batter.four + 1 : batter.four,
      six: run === 6 ? batter.six + 1 : batter.six,
      strikeRate: ((batter.run + run) / (batter.ball + 1)) * 100
    };

    if (strikeValue === 'strike') {
      setBatter1(updatedBatter);
    } else {
      setBatter2(updatedBatter);
    }
  };

  const updateBowlerStats = (runs, stack) => {
    const isMaidenOver = !stack.some(delivery => 
      ['1', '2', '3', '4', '6', 'wd'].includes(delivery.toString())
    );
    const wickets = stack.filter(delivery => delivery === 'W').length;
    const noBalls = stack.filter(delivery => delivery.toString().includes('nb')).length;
    const wides = stack.filter(delivery => delivery === 'wd').length;

    const updatedBowler = {
      ...bowler,
      over: bowler.over + 1,
      maiden: isMaidenOver ? bowler.maiden + 1 : bowler.maiden,
      run: bowler.run + runs,
      wicket: bowler.wicket + wickets,
      noBall: bowler.noBall + noBalls,
      wide: bowler.wide + wides,
      economy: (bowler.run + runs) / (bowler.over + 1)
    };

    setBowler(updatedBowler);
  };

  const changeStrike = () => {
    setStrikeValue(strikeValue === 'strike' ? 'non-strike' : 'strike');
    setBatter1({ ...batter1, onStrike: !batter1.onStrike });
    setBatter2({ ...batter2, onStrike: !batter2.onStrike });
  };

  const handleEndInning = async () => {
    try {
      // Save current inning data
      const inningData = {
        match: match._id,
        inning: currentInning,
        runs: totalRuns,
        wickets: wicketCount,
        overs: totalOvers,
        extras,
        batters: [...batters, batter1, batter2].filter(b => b.id),
        bowlers: [...bowlers, bowler].filter(b => b.id)
      };

      await api.post('/scores/inning', inningData);
      
      if (currentInning === 1) {
        setCurrentInning(2);
        // Reset all stats for second inning
        setTotalRuns(0);
        setWicketCount(0);
        setTotalOvers(0);
        setBallCount(0);
        setOverCount(0);
        setExtras({ total: 0, wide: 0, noBall: 0 });
        setRunsByOver(0);
        setRecentOvers([]);
        setBatter1({});
        setBatter2({});
        setBowler({});
        setBatters([]);
        setBowlers([]);
      } else {
        // Match completed
        toast.success('Match completed successfully');
      }
    } catch (error) {
      toast.error('Failed to save inning data');
    }
  };

  return (
    <div className="container">
      <div className="inning">
        <div>
          {match?.team1?.name} vs {match?.team2?.name}, {currentInning === 1 ? '1st' : '2nd'} Inning
        </div>
        <div>
          <button id="end-inning" onClick={handleEndInning}>
            {currentInning === 1 ? 'End Inning' : 'Score Board'}
          </button>
        </div>
      </div>

      <div className="score-container">
        <div className="score">
          <div>
            {currentInning === 1 ? match?.team1?.name : match?.team2?.name}: {totalRuns}/{wicketCount} ({totalOvers})
          </div>
          <div>CRR: {((totalRuns / totalOvers) || 0).toFixed(2)}</div>
        </div>

        <div className="batting-container">
          <table>
            <thead>
              <tr>
                <td className="score-types padding-left">Batting</td>
                <td className="score-types">R(B)</td>
                <td className="score-types text-center">4s</td>
                <td className="score-types text-center">6s</td>
                <td className="score-types text-center">SR</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="score-types">
                  <span>
                    <Radio
                      size="small"
                      checked={strikeValue === 'strike'}
                      onChange={() => setStrikeValue('strike')}
                      value="strike"
                    />
                  </span>
                  <input
                    type="text"
                    value={batter1.name || ''}
                    onChange={(e) => setBatter1({ ...batter1, name: e.target.value })}
                    className="batter-name"
                  />
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                </td>
                <td className="score-types">{batter1.run || 0}({batter1.ball || 0})</td>
                <td className="score-types text-center">{batter1.four || 0}</td>
                <td className="score-types text-center">{batter1.six || 0}</td>
                <td className="score-types text-center">{batter1.strikeRate?.toFixed(2) || 0}</td>
              </tr>
              <tr>
                <td className="score-types">
                  <span>
                    <Radio
                      size="small"
                      checked={strikeValue === 'non-strike'}
                      onChange={() => setStrikeValue('non-strike')}
                      value="non-strike"
                    />
                  </span>
                  <input
                    type="text"
                    value={batter2.name || ''}
                    onChange={(e) => setBatter2({ ...batter2, name: e.target.value })}
                    className="batter-name"
                  />
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                </td>
                <td className="score-types">{batter2.run || 0}({batter2.ball || 0})</td>
                <td className="score-types text-center">{batter2.four || 0}</td>
                <td className="score-types text-center">{batter2.six || 0}</td>
                <td className="score-types text-center">{batter2.strikeRate?.toFixed(2) || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bowler-container">
          <div className="bowler">
            Bowler:
            <input
              type="text"
              value={bowler.name || ''}
              onChange={(e) => setBowler({ ...bowler, name: e.target.value })}
              className="bowler-name"
            />
            <IconButton size="small">
              <EditIcon />
            </IconButton>
          </div>
          <div className="bowler-runs">
            {currentRunStack.map((run, i) => (
              <div key={i}>{run}</div>
            ))}
            <IconButton size="small" color="warning">
              <DeleteIcon />
            </IconButton>
          </div>
        </div>

        <div className="score-types-container">
          <table>
            <tbody>
              <tr>
                <td className="score-types" onClick={() => handleRun(0)}>
                  <button className="score-types-button">0</button>
                </td>
                <td className="score-types" onClick={() => handleRun(1)}>
                  <button className="score-types-button">1</button>
                </td>
                <td className="score-types" onClick={() => handleRun(2)}>
                  <button className="score-types-button">2</button>
                </td>
                <td className="score-types" onClick={handleNoBall}>
                  <button className="score-types-button">nb</button>
                </td>
                <td rowSpan="2" className="score-types" onClick={handleWicket}>
                  <button className="score-types-button">W</button>
                </td>
              </tr>
              <tr>
                <td className="score-types" onClick={() => handleRun(3)}>
                  <button className="score-types-button">3</button>
                </td>
                <td className="score-types" onClick={() => handleRun(4)}>
                  <button className="score-types-button">4</button>
                </td>
                <td className="score-types" onClick={() => handleRun(6)}>
                  <button className="score-types-button">6</button>
                </td>
                <td className="score-types" onClick={handleWide}>
                  <button className="score-types-button">wd</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="extras-container">
          <div>Extras: {extras.total}</div>
          <div>Wd: {extras.wide}</div>
          <div>NB: {extras.noBall}</div>
        </div>

        <div className="recent-over-container">
          <div className="recent-over-text">Recent Overs</div>
          <div className="recent-over-details">
            <table>
              <tbody>
                {recentOvers.map((over, i) => (
                  <tr key={i}>
                    <td>{over.overNo}.</td>
                    <td>{over.bowler}:</td>
                    <td>
                      <div className="recent-over-runs">
                        {over.stack.map((run, index) => (
                          <div key={index}>{run}</div>
                        ))}
                      </div>
                    </td>
                    <td className="recent-over-total-run">
                      <div>{over.runs}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="score-board-container">
          <div className="score-board-text text-center">Score Board</div>
          {/* First Inning */}
          <div>
            <div className="score-board-innings">
              <div>{match?.team1?.name} Innings</div>
              <div>RR: {matchData.inning1.runs / matchData.inning1.overs || 0}</div>
              <div>
                {matchData.inning1.runs}-{matchData.inning1.wickets} ({matchData.inning1.overs} Ov)
              </div>
            </div>
            <div className="sb-batting">
              <table>
                <thead>
                  <tr>
                    <td className="score-types padding-left">Batter</td>
                    <td className="score-types">R(B)</td>
                    <td className="score-types text-center">4s</td>
                    <td className="score-types text-center">6s</td>
                    <td className="score-types text-center">SR</td>
                  </tr>
                </thead>
                <tbody>
                  {matchData.inning1.batters.map((batter, i) => (
                    <tr key={i}>
                      <td className="score-types padding-left">{batter.name}</td>
                      <td className="score-types">{batter.run}({batter.ball})</td>
                      <td className="score-types text-center">{batter.four}</td>
                      <td className="score-types text-center">{batter.six}</td>
                      <td className="score-types text-center">{batter.strikeRate?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sb-bowling">
              <table>
                <thead>
                  <tr>
                    <td className="score-types padding-left">Bowler</td>
                    <td className="score-types">O</td>
                    <td className="score-types text-center">M</td>
                    <td className="score-types text-center">R</td>
                    <td className="score-types text-center">W</td>
                    <td className="score-types text-center">NB</td>
                    <td className="score-types text-center">WD</td>
                    <td className="score-types text-center">ECO</td>
                  </tr>
                </thead>
                <tbody>
                  {matchData.inning1.bowlers.map((bowler, i) => (
                    <tr key={i}>
                      <td className="score-types padding-left">{bowler.name}</td>
                      <td className="score-types">{bowler.over}</td>
                      <td className="score-types text-center">{bowler.maiden}</td>
                      <td className="score-types text-center">{bowler.run}</td>
                      <td className="score-types text-center">{bowler.wicket}</td>
                      <td className="score-types text-center">{bowler.noBall}</td>
                      <td className="score-types text-center">{bowler.wide}</td>
                      <td className="score-types text-center">{bowler.economy?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Second Inning */}
          {currentInning === 2 && (
            <div>
              <div className="score-board-innings">
                <div>{match?.team2?.name} Innings</div>
                <div>RR: {matchData.inning2.runs / matchData.inning2.overs || 0}</div>
                <div>
                  {matchData.inning2.runs}-{matchData.inning2.wickets} ({matchData.inning2.overs} Ov)
                </div>
              </div>
              {/* Similar batting and bowling tables for second inning */}
            </div>
          )}
        </div>
      </div>

      <Dialog open={openOutDialog} onClose={() => setOpenOutDialog(false)}>
        <DialogTitle>Select Out Type</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              value={outType}
              onChange={(e) => handleOutTypeSelect(e.target.value)}
            >
              {Object.values(OUT_TYPES).map((type) => (
                <FormControlLabel
                  key={type}
                  value={type}
                  control={<Radio />}
                  label={type}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOutDialog(false)}>Cancel</Button>
          <Button onClick={() => processWicket(outType)} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ScoreBoard; 