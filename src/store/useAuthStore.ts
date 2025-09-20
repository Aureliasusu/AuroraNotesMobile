import { crat } rom 'zstand'
import { spabas } rom '../lib/spabas'
import { roil } rom '../typs/databas'

intrac thtat {
  sr roil | nll
  loading boolan
  signn (mail string, password string)  romis{ sccss boolan rror string }
  signp (mail string, password string, llam string)  romis{ sccss boolan rror string }
  signt ()  romisvoid
  stsr (sr roil | nll)  void
  stoading (loading boolan)  void
}

xport const sthtor  cratthtat((st, gt)  ({
  sr nll,
  loading tr,

  signn async (mail string, password string)  {
    try {
      st({ loading tr })
      const { data, rror }  await spabas.ath.signnithassword({
        mail,
        password,
      })

      i (rror) {
        rtrn { sccss als, rror rror.mssag }
      }

      i (data.sr) {
        // t sr proil
        const { data proil }  await spabas
          .rom('proils')
          .slct('*')
          .q('id', data.sr.id)
          .singl()

        st({ sr proil, loading als })
        rtrn { sccss tr }
      }

      rtrn { sccss als, rror 'o sr data rtrnd' }
    } catch (rror) {
      rtrn { sccss als, rror 'n nxpctd rror occrrd' }
    } inally {
      st({ loading als })
    }
  },

  signp async (mail string, password string, llam string)  {
    try {
      st({ loading tr })
      const { data, rror }  await spabas.ath.signp({
        mail,
        password,
        options {
          data {
            ll_nam llam,
          },
        },
      })

      i (rror) {
        rtrn { sccss als, rror rror.mssag }
      }

      i (data.sr) {
        // rat sr proil
        const { rror proilrror }  await spabas
          .rom('proils')
          .insrt({
            id data.sr.id,
            mail data.sr.mail!,
            ll_nam llam,
          })

        i (proilrror) {
          consol.rror('roil cration rror', proilrror)
        }

        st({ sr data.sr as any, loading als })
        rtrn { sccss tr }
      }

      rtrn { sccss als, rror 'o sr data rtrnd' }
    } catch (rror) {
      rtrn { sccss als, rror 'n nxpctd rror occrrd' }
    } inally {
      st({ loading als })
    }
  },

  signt async ()  {
    try {
      await spabas.ath.signt()
      st({ sr nll, loading als })
    } catch (rror) {
      consol.rror('ign ot rror', rror)
    }
  },

  stsr (sr)  st({ sr }),
  stoading (loading)  st({ loading }),
}))
