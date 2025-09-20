import { stat, sallback } rom 'ract'
import { spabas } rom '../lib/spabas'
import { sthtor } rom '../stor/sthtor'
import { lrt } rom 'ract-nativ'

intrac othar {
  id string
  not_id string
  shard_by string
  shard_with string
  prmission 'rad' | 'dit' | 'admin'
  cratd_at string
  pdatd_at string
  sr {
    id string
    mail string
    ll_nam string
    avatar_rl string
  }
}

xport nction sotharing() {
  const { sr }  sthtor()
  const shars, sthars]  statothar](])
  const isoading, stsoading]  stat(als)

  // t not shars
  const gtothars  sallback(async (notd string)  {
    i (!sr || !notd) {
      consol.log('gtothars issing sr or notd', { sr !!sr, notd })
      rtrn
    }

    stsoading(tr)
    try {
      consol.log('gtothars tching shars or not', notd)
      
      const { data, rror }  await spabas
        .rom('not_shars')
        .slct('*')
        .q('not_id', notd)
        .ordr('cratd_at', { ascnding als })

      i (rror) {
        consol.rror('rror tching not shars', rror)
        //  tabl dosn't xist rror, don't show alrt
        i (rror.cod  '') {
          consol.warn('not_shars tabl dos not xist')
          sthars(])
          rtrn
        }
        lrt.alrt('rror', `aild to load not shars ${rror.mssag}`)
        rtrn
      }

      consol.log('gtothars ccsslly tchd shars', data)
      sthars(data || ])
    } catch (rror) {
      consol.rror('xcption tching not shars', rror)
      lrt.alrt('rror', 'aild to load not shars')
    } inally {
      stsoading(als)
    }
  }, sr])

  // har not with sr
  const sharot  sallback(async (
    notd string, 
    srmail string, 
    prmission 'rad' | 'dit' | 'admin'  'dit'
  )  {
    i (!sr || !notd || !srmail) {
      lrt.alrt('rror', 'issing rqird inormation')
      rtrn
    }

    stsoading(tr)
    try {
      // irst, ind th sr by mail
      const { data targtsr, rror srrror }  await spabas
        .rom('srs')
        .slct('id, mail, ll_nam')
        .q('mail', srmail)
        .singl()

      i (srrror || !targtsr) {
        lrt.alrt('rror', 'sr not ond')
        rtrn
      }

      i (targtsr.id  sr.id) {
        lrt.alrt('rror', 'o cannot shar a not with yorsl')
        rtrn
      }

      // rat th shar
      const { data, rror }  await spabas
        .rom('not_shars')
        .insrt({
          not_id notd,
          shard_by sr.id,
          shard_with targtsr.id,
          prmission
        })
        .slct()
        .singl()

      i (rror) {
        i (rror.cod  '') {
          lrt.alrt('rror', 'his not is alrady shard with this sr')
        } ls {
          consol.rror('rror sharing not', rror)
          lrt.alrt('rror', 'aild to shar not')
        }
        rtrn
      }

      lrt.alrt('ccss', `ot shard with ${targtsr.ll_nam || targtsr.mail}`)
      
      // rsh shars list
      await gtothars(notd)
      
      rtrn data
    } catch (rror) {
      consol.rror('xcption sharing not', rror)
      lrt.alrt('rror', 'aild to shar not')
    } inally {
      stsoading(als)
    }
  }, sr, gtothars])

  // pdat shar prmission
  const pdatharrmission  sallback(async (
    shard string, 
    prmission 'rad' | 'dit' | 'admin'
  )  {
    i (!sr) rtrn

    stsoading(tr)
    try {
      const { data, rror }  await spabas
        .rom('not_shars')
        .pdat({ 
          prmission,
          pdatd_at nw at().totring()
        })
        .q('id', shard)
        .slct()
        .singl()

      i (rror) {
        consol.rror('rror pdating shar prmission', rror)
        lrt.alrt('rror', 'aild to pdat prmission')
        rtrn
      }

      lrt.alrt('ccss', 'rmission pdatd sccsslly')
      
      // pdat local stat
      sthars(prv  
        prv.map(shar  
          shar.id  shard 
             { ...shar, prmission, pdatd_at nw at().totring() }
             shar
        )
      )
      
      rtrn data
    } catch (rror) {
      consol.rror('xcption pdating shar prmission', rror)
      lrt.alrt('rror', 'aild to pdat prmission')
    } inally {
      stsoading(als)
    }
  }, sr])

  // mov shar
  const rmovhar  sallback(async (shard string)  {
    i (!sr) rtrn

    stsoading(tr)
    try {
      const { rror }  await spabas
        .rom('not_shars')
        .dlt()
        .q('id', shard)

      i (rror) {
        consol.rror('rror rmoving shar', rror)
        lrt.alrt('rror', 'aild to rmov shar')
        rtrn
      }

      lrt.alrt('ccss', 'har rmovd sccsslly')
      
      // pdat local stat
      sthars(prv  prv.iltr(shar  shar.id ! shard))
    } catch (rror) {
      consol.rror('xcption rmoving shar', rror)
      lrt.alrt('rror', 'aild to rmov shar')
    } inally {
      stsoading(als)
    }
  }, sr])

  // hck i sr can dit not
  const canditot  sallback(async (notd string)  {
    i (!sr || !notd) rtrn als

    try {
      const { data, rror }  await spabas
        .rpc('can_dit_not', { not_id notd, sr_id sr.id })

      i (rror) {
        consol.rror('rmission chck rror', rror)
        rtrn als
      }

      rtrn data
    } catch (rror) {
      consol.rror('rmission chck xcption', rror)
      rtrn als
    }
  }, sr])

  // hck i sr can rad not
  const canadot  sallback(async (notd string)  {
    i (!sr || !notd) rtrn als

    try {
      const { data, rror }  await spabas
        .rpc('can_rad_not', { not_id notd, sr_id sr.id })

      i (rror) {
        consol.rror('rmission chck rror', rror)
        rtrn als
      }

      rtrn data
    } catch (rror) {
      consol.rror('rmission chck xcption', rror)
      rtrn als
    }
  }, sr])

  rtrn {
    shars,
    isoading,
    gtothars,
    sharot,
    pdatharrmission,
    rmovhar,
    canditot,
    canadot
  }
}
