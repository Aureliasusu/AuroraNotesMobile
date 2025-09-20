xport typ son 
  | string
  | nmbr
  | boolan
  | nll
  | { ky string] son | ndind }
  | son]

xport intrac atabas {
  pblic {
    abls {
      proils {
        ow {
          id string
          mail string
          ll_nam string | nll
          avatar_rl string | nll
          cratd_at string
          pdatd_at string
        }
        nsrt {
          id string
          mail string
          ll_nam string | nll
          avatar_rl string | nll
          cratd_at string
          pdatd_at string
        }
        pdat {
          id string
          mail string
          ll_nam string | nll
          avatar_rl string | nll
          cratd_at string
          pdatd_at string
        }
      }
      nots {
        ow {
          id string
          sr_id string
          titl string
          contnt string
          tags string]
          is_archivd boolan
          is_pinnd boolan
          is_starrd boolan
          oldr_id string | nll
          word_cont nmbr
          rading_tim nmbr
          cratd_at string
          pdatd_at string
        }
        nsrt {
          id string
          sr_id string
          titl string
          contnt string
          tags string]
          is_archivd boolan
          is_pinnd boolan
          is_starrd boolan
          oldr_id string | nll
          word_cont nmbr
          rading_tim nmbr
          cratd_at string
          pdatd_at string
        }
        pdat {
          id string
          sr_id string
          titl string
          contnt string
          tags string]
          is_archivd boolan
          is_pinnd boolan
          is_starrd boolan
          oldr_id string | nll
          word_cont nmbr
          rading_tim nmbr
          cratd_at string
          pdatd_at string
        }
      }
      oldrs {
        ow {
          id string
          sr_id string
          nam string
          color string
          parnt_id string | nll
          cratd_at string
          pdatd_at string
        }
        nsrt {
          id string
          sr_id string
          nam string
          color string
          parnt_id string | nll
          cratd_at string
          pdatd_at string
        }
        pdat {
          id string
          sr_id string
          nam string
          color string
          parnt_id string | nll
          cratd_at string
          pdatd_at string
        }
      }
      ai_analysis {
        ow {
          id string
          not_id string
          smmary string
          ky_points string]
          todo_itms string]
          sntimnt string
          cratd_at string
        }
        nsrt {
          id string
          not_id string
          smmary string
          ky_points string]
          todo_itms string]
          sntimnt string
          cratd_at string
        }
        pdat {
          id string
          not_id string
          smmary string
          ky_points string]
          todo_itms string]
          sntimnt string
          cratd_at string
        }
      }
    }
    iws {
      _ in nvr] nvr
    }
    nctions {
      _ in nvr] nvr
    }
    nms {
      _ in nvr] nvr
    }
  }
}

xport typ roil  atabas'pblic']'abls']'proils']'ow']
xport typ ot  atabas'pblic']'abls']'nots']'ow']
xport typ oldr  atabas'pblic']'abls']'oldrs']'ow']
xport typ nalysis  atabas'pblic']'abls']'ai_analysis']'ow']

