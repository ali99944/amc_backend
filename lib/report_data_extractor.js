export const extractReportData = async (reportType) => {
  switch (reportType) {
    case 'engagement_report':
      return await extractEngagementReportData();
    case 'user_report':
      return await extractUserReportData();
    case 'content_report':
      return await extractContentReportData();
    default:
      throw new Error(`Unknown report type: ${reportType}`);
  }
};

const extractEngagementReportData = async () => {
    const data = {
        title: "تقرير التفاعل",
        description: "نظرة عامة على بيانات التفاعل",
        date_range: {
            start_date: "01-01-2023",
            end_date: "31-01-2023"
        },
        generated_at: "01-02-2023",
        metrics: {
            total_plays: true,
            listening_hours: true,
            session_duration: true,
            user_engagement: true,
            popular_times: true
        },
        total_plays: {
            value: 100000,
            change: 10,
            change_positive: true
        },
        listening_hours: {
            value: 20000,
            average_per_user: 5
        },
        session_duration: {
            value: 30
        },
        user_engagement: {
            value: 75
        },
        popular_times: {
            hourly: [
                {
                    hour: 12,
                    activity_level: 100,
                    is_peak: true
                },
                {
                    hour: 13,
                    activity_level: 80
                },
                {
                    hour: 14,
                    activity_level: 60
                },
                {
                    hour: 15,
                    activity_level: 40
                },
                {
                    hour: 16,
                    activity_level: 20
                }
            ]
        }
    };

    return data;
}

const extractUserReportData = async () => {
  const data = {
    title: "تقرير المستخدمين",
    description: "نظرة عامة على بيانات المستخدمين",
    date_range: {
      start_date: "01-01-2023",
      end_date: "31-01-2023"
    },
    generated_at: "01-02-2023",
    metrics: {
      total_users: true,
      active_users: true,
      new_users: true,
      user_retention: true,
      user_demographics: true
    },
    data: {
      total_users: {
        value: 5000,
        change: 5,
        change_positive: true
      },
      active_users: {
        value: 1500,
        percentage: 30
      },
      new_users: {
        value: 200,
        daily_average: 6.5
      },
      user_retention: {
        value: 65
      },
      user_demographics: {
        age_groups: [
          { range: "18-24", count: 1500, percentage: 30 },
          { range: "25-34", count: 2000, percentage: 40 },
          { range: "35-44", count: 1000, percentage: 20 },
          { range: "45+", count: 500, percentage: 10 }
        ]
      },
      top_users: [
        { name: "User1", sessions: 50, listening_hours: 120 },
        { name: "User2", sessions: 40, listening_hours: 100 }
      ],
      activity_by_time: [
        { time_period: "Morning", active_users: 800, percentage: 40 },
        { time_period: "Afternoon", active_users: 500, percentage: 25 },
        { time_period: "Evening", active_users: 700, percentage: 35 }
      ]
    },
  };

  return data;
};

const extractContentReportData = async () => {
  const data = {
    title: "تقرير المحتوى",
    description: "نظرة عامة على بيانات المحتوى",
    date_range: {
      start_date: "01-01-2023",
      end_date: "31-01-2023"
    },
    generated_at: "01-02-2023",
    metrics: {
      total_songs: true,
      total_artists: true,
      total_playlists: true,
      content_growth: true,
      popular_content: true
    },
    data: {
      total_songs: {
        value: 50000,
        change: 5,
        change_positive: true
      },
      total_artists: {
        value: 1000
      },
      total_playlists: {
        value: 2000,
        public: 1500,
        private: 500
      },
      content_growth: {
        value: 20
      },
      popular_content: {
        songs: [
          { title: "Song1", artist: "Artist1", plays: 10000, rating: 4.5, genres: ["genre1", "genre2"] },
          { title: "Song2", artist: "Artist2", plays: 8000, rating: 4.2, genres: ["genre3", "genre4"] },
          { title: "Song3", artist: "Artist3", plays: 7000, rating: 4.8, genres: ["genre5", "genre6"] }
        ]
      }
    },
  };

  return data;
};

