-- Sample Teams
INSERT INTO teams (name, short_name, country, home_venue) VALUES
('Brazilian Volleyball Team', 'BRA', 'Brazil', 'Ginásio do Maracanãzinho'),
('USA Volleyball', 'USA', 'United States', 'Pauley Pavilion'),
('Poland National Team', 'POL', 'Poland', 'Tauron Arena Kraków'),
('Italy Volleyball', 'ITA', 'Italy', 'PalaLottomatica'),
('Russian Volleyball Federation', 'RUS', 'Russia', 'Megasport Arena'),
('Serbia National Team', 'SRB', 'Serbia', 'Štark Arena');

-- Sample Tournament
INSERT INTO tournaments (name, short_name, country, season, is_active, start_date, end_date) VALUES
('FIVB Volleyball Nations League', 'VNL', 'International', '2025', true, '2025-05-15', '2025-07-30');

-- Get tournament ID for matches
DO $$
DECLARE
    vnl_id UUID;
    brazil_id UUID;
    usa_id UUID;
    poland_id UUID;
    italy_id UUID;
BEGIN
    SELECT id INTO vnl_id FROM tournaments WHERE short_name = 'VNL' LIMIT 1;
    SELECT id INTO brazil_id FROM teams WHERE short_name = 'BRA' LIMIT 1;
    SELECT id INTO usa_id FROM teams WHERE short_name = 'USA' LIMIT 1;
    SELECT id INTO poland_id FROM teams WHERE short_name = 'POL' LIMIT 1;
    SELECT id INTO italy_id FROM teams WHERE short_name = 'ITA' LIMIT 1;

    -- Sample Matches
    -- Live match
    INSERT INTO matches (tournament_id, home_team_id, away_team_id, scheduled_at, status, venue, round, home_score, away_score, current_set)
    VALUES (vnl_id, brazil_id, usa_id, NOW(), 'live', 'Ginásio do Maracanãzinho', 'Pool Play', 2, 1, 4);

    -- Upcoming matches
    INSERT INTO matches (tournament_id, home_team_id, away_team_id, scheduled_at, status, venue, round)
    VALUES 
    (vnl_id, poland_id, italy_id, NOW() + INTERVAL '2 hours', 'scheduled', 'Tauron Arena Kraków', 'Pool Play'),
    (vnl_id, usa_id, poland_id, NOW() + INTERVAL '1 day', 'scheduled', 'Pauley Pavilion', 'Pool Play');

    -- Finished match
    INSERT INTO matches (tournament_id, home_team_id, away_team_id, scheduled_at, status, venue, round, home_score, away_score, finished_at)
    VALUES (vnl_id, italy_id, brazil_id, NOW() - INTERVAL '1 day', 'finished', 'PalaLottomatica', 'Pool Play', 3, 1, NOW() - INTERVAL '22 hours');
END $$;

-- Sample Sets for Live Match
DO $$
DECLARE
    live_match_id UUID;
BEGIN
    SELECT id INTO live_match_id FROM matches WHERE status = 'live' LIMIT 1;

    INSERT INTO sets (match_id, set_number, home_points, away_points, status) VALUES
    (live_match_id, 1, 25, 22, 'finished'),
    (live_match_id, 2, 23, 25, 'finished'),
    (live_match_id, 3, 25, 20, 'finished'),
    (live_match_id, 4, 18, 15, 'in_progress');
END $$;

-- Sample Sets for Finished Match
DO $$
DECLARE
    finished_match_id UUID;
BEGIN
    SELECT id INTO finished_match_id FROM matches WHERE status = 'finished' LIMIT 1;

    INSERT INTO sets (match_id, set_number, home_points, away_points, status) VALUES
    (finished_match_id, 1, 25, 20, 'finished'),
    (finished_match_id, 2, 25, 18, 'finished'),
    (finished_match_id, 3, 22, 25, 'finished'),
    (finished_match_id, 4, 25, 21, 'finished');
END $$;

-- Sample Players for Brazil
DO $$
DECLARE
    brazil_id UUID;
BEGIN
    SELECT id INTO brazil_id FROM teams WHERE short_name = 'BRA' LIMIT 1;

    INSERT INTO players (team_id, first_name, last_name, jersey_number, position, height_cm, nationality) VALUES
    (brazil_id, 'Bruninho', 'Silva', 10, 'Setter', 184, 'Brazil'),
    (brazil_id, 'Wallace', 'Souza', 5, 'Outside Hitter', 201, 'Brazil'),
    (brazil_id, 'Lucas', 'Saatkamp', 8, 'Middle Blocker', 210, 'Brazil'),
    (brazil_id, 'Ricardo', 'Lucarelli', 11, 'Outside Hitter', 192, 'Brazil');
END $$;

-- Sample Players for USA
DO $$
DECLARE
    usa_id UUID;
BEGIN
    SELECT id INTO usa_id FROM teams WHERE short_name = 'USA' LIMIT 1;

    INSERT INTO players (team_id, first_name, last_name, jersey_number, position, height_cm, nationality) VALUES
    (usa_id, 'Matthew', 'Anderson', 1, 'Outside Hitter', 205, 'USA'),
    (usa_id, 'Micah', 'Christenson', 11, 'Setter', 198, 'USA'),
    (usa_id, 'Maxwell', 'Holt', 14, 'Middle Blocker', 203, 'USA'),
    (usa_id, 'Taylor', 'Sander', 3, 'Outside Hitter', 198, 'USA');
END $$;
