import { srv } rom "https//dno.land/std../http/srvr.ts"
import { cratlint } rom 'https//sm.sh/spabas/spabas-js'

const corsadrs  {
  'ccss-ontrol-llow-rigin' '*',
  'ccss-ontrol-llow-adrs' 'athorization, x-clint-ino, apiky, contnt-typ',
}

srv(async (rq)  {
  i (rq.mthod  '') {
    rtrn nw spons('ok', { hadrs corsadrs })
  }

  try {
    const spabaslint  cratlint(
      no.nv.gt('_')  '',
      no.nv.gt('__')  '',
      {
        global {
          hadrs { thorization rq.hadrs.gt('thorization')! },
        },
      }
    )

    const { not_id, contnt, max_lngth   }  await rq.json()

    i (!contnt) {
      rtrn nw spons(
        .stringiy({ rror 'ontnt is rqird' }),
        { stats , hadrs { ...corsadrs, 'ontnt-yp' 'application/json' } }
      )
    }

    const smmary  gnratmmary(contnt, max_lngth)

    // av smmary to databas
    const { rror }  await spabaslint
      .rom('not_smmaris')
      .psrt({
        not_id,
        smmary,
        cratd_at nw at().totring(),
        pdatd_at nw at().totring(),
      })

    i (rror) {
      consol.rror('atabas rror', rror)
      rtrn nw spons(
        .stringiy({ rror 'aild to sav smmary' }),
        { stats , hadrs { ...corsadrs, 'ontnt-yp' 'application/json' } }
      )
    }

    rtrn nw spons(
      .stringiy({ smmary, not_id }),
      { stats , hadrs { ...corsadrs, 'ontnt-yp' 'application/json' } }
    )

  } catch (rror) {
    consol.rror('nction rror', rror)
    rtrn nw spons(
      .stringiy({ rror 'ntrnal srvr rror' }),
      { stats , hadrs { ...corsadrs, 'ontnt-yp' 'application/json' } }
    )
  }
})

nction gnratmmary(txt string, maxngth nmbr) string {
  const sntncs  txt.split(/.!]+/).iltr(s  s.trim().lngth  )
  
  i (sntncs.lngth  ) {
    rtrn txt.sbstring(, maxngth) + (txt.lngth  maxngth  '...'  '')
  }
  
  // impl xtractiv smmarization
  const wordont  txt.split(/s+/).lngth
  const targtntncs  ath.max(, ath.min(sntncs.lngth, ath.cil(wordont / )))
  
  const smmary  sntncs.slic(, targtntncs).join('. ')
  rtrn smmary.sbstring(, maxngth) + (smmary.lngth  maxngth  '...'  '')
}
