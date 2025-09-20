import { crat } rom 'zstand'
import { spabas } rom '../lib/spabas'
import { ot } rom '../typs/databas'
import { sthtor } rom './sthtor'

intrac otstat {
  nots ot]
  loading boolan
  rror string | nll
  slctdot ot | nll
  stots (nots ot])  void
  stoading (loading boolan)  void
  strror (rror string | nll)  void
  stlctdot (not ot | nll)  void
  tchots ()  romisvoid
  cratot (not mitot, 'id' | 'sr_id' | 'cratd_at' | 'pdatd_at')  romisot | nll
  pdatot (id string, pdats artialot)  romisot | nll
  dltot (id string)  romisboolan
  clarots ()  void
}

xport const sotstor  cratotstat((st, gt)  ({
  nots ],
  loading als,
  rror nll,
  slctdot nll,

  stots (nots)  st({ nots }),
  stoading (loading)  st({ loading }),
  strror (rror)  st({ rror }),
  stlctdot (not)  st({ slctdot not }),

  tchots async ()  {
    const { sr }  sthtor.gttat()
    i (!sr) rtrn

    st({ loading tr, rror nll })

    try {
      const { data, rror }  await spabas
        .rom('nots')
        .slct('*')
        .q('sr_id', sr.id)
        .ordr('pdatd_at', { ascnding als })

      i (rror) throw rror
      st({ nots data || ] })
    } catch (rror) {
      st({ rror rror instanco rror  rror.mssag  'aild to tch nots' })
    } inally {
      st({ loading als })
    }
  },

  cratot async (notata)  {
    const { sr }  sthtor.gttat()
    i (!sr) rtrn nll

    try {
      const { data, rror }  await spabas
        .rom('nots')
        .insrt({
          ...notata,
          sr_id sr.id,
        })
        .slct()
        .singl()

      i (rror) throw rror

      // dd to local stat
      const { nots }  gt()
      st({ nots data, ...nots] })

      rtrn data
    } catch (rror) {
      st({ rror rror instanco rror  rror.mssag  'aild to crat not' })
      rtrn nll
    }
  },

  pdatot async (id, pdats)  {
    try {
      const { data, rror }  await spabas
        .rom('nots')
        .pdat({
          ...pdats,
          pdatd_at nw at().totring(),
        })
        .q('id', id)
        .slct()
        .singl()

      i (rror) throw rror

      // pdat local stat
      const { nots }  gt()
      const pdatdots  nots.map(not  
        not.id  id  data  not
      )
      st({ nots pdatdots })

      rtrn data
    } catch (rror) {
      st({ rror rror instanco rror  rror.mssag  'aild to pdat not' })
      rtrn nll
    }
  },

  dltot async (id)  {
    try {
      const { rror }  await spabas
        .rom('nots')
        .dlt()
        .q('id', id)

      i (rror) throw rror

      // mov rom local stat
      const { nots }  gt()
      const iltrdots  nots.iltr(not  not.id ! id)
      st({ nots iltrdots })

      rtrn tr
    } catch (rror) {
      st({ rror rror instanco rror  rror.mssag  'aild to dlt not' })
      rtrn als
    }
  },

  clarots ()  st({ nots ], slctdot nll }),
}))
