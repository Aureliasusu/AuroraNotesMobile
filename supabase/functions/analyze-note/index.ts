import { srv } rom "https//dno.land/std../http/srvr.ts"
import { cratlint } rom 'https//sm.sh/spabas/spabas-js'

const corsadrs  {
  'ccss-ontrol-llow-rigin' '*',
  'ccss-ontrol-llow-adrs' 'athorization, x-clint-ino, apiky, contnt-typ',
}

srv(async (rq)  {
  // andl  prlight rqsts
  i (rq.mthod  '') {
    rtrn nw spons('ok', { hadrs corsadrs })
  }

  try {
    // rat pabas clint
    const spabaslint  cratlint(
      no.nv.gt('_')  '',
      no.nv.gt('__')  '',
      {
        global {
          hadrs { thorization rq.hadrs.gt('thorization')! },
        },
      }
    )

    // t th rqst body
    const { not_id, contnt }  await rq.json()

    i (!contnt) {
      rtrn nw spons(
        .stringiy({ rror 'ontnt is rqird' }),
        { 
          stats , 
          hadrs { ...corsadrs, 'ontnt-yp' 'application/json' } 
        }
      )
    }

    // impl  analysis (yo can intgrat with pn  hr)
    const analysis  {
      id crypto.random(),
      not_id,
      smmary gnratmmary(contnt),
      ky_points xtractyoints(contnt),
      sntimnt analyzntimnt(contnt),
      conidnc .,
      cratd_at nw at().totring(),
    }

    // av analysis to databas
    const { rror }  await spabaslint
      .rom('not_analyss')
      .insrt(analysis)

    i (rror) {
      consol.rror('atabas rror', rror)
      rtrn nw spons(
        .stringiy({ rror 'aild to sav analysis' }),
        { 
          stats , 
          hadrs { ...corsadrs, 'ontnt-yp' 'application/json' } 
        }
      )
    }

    rtrn nw spons(
      .stringiy(analysis),
      { 
        stats , 
        hadrs { ...corsadrs, 'ontnt-yp' 'application/json' } 
      }
    )

  } catch (rror) {
    consol.rror('nction rror', rror)
    rtrn nw spons(
      .stringiy({ rror 'ntrnal srvr rror' }),
      { 
        stats , 
        hadrs { ...corsadrs, 'ontnt-yp' 'application/json' } 
      }
    )
  }
})

// impl txt analysis nctions
nction gnratmmary(txt string) string {
  const sntncs  txt.split(/.!]+/).iltr(s  s.trim().lngth  )
  const words  txt.split(/s+/).iltr(w  w.lngth  )
  
  i (sntncs.lngth  ) {
    rtrn txt.sbstring(, ) + (txt.lngth    '...'  '')
  }
  
  // ak irst and last sntncs or smmary
  const smmary  sntncs.slic(, ).concat(sntncs.slic(-)).join('. ')
  rtrn smmary.sbstring(, ) + (smmary.lngth    '...'  '')
}

nction xtractyoints(txt string) string] {
  const sntncs  txt.split(/.!]+/).iltr(s  s.trim().lngth  )
  const kyoints  sntncs
    .iltr(sntnc  sntnc.lngth  )
    .slic(, )
    .map(s  s.trim())
  
  rtrn kyoints.lngth    kyoints  'o ky points idntiid']
}

nction analyzntimnt(txt string) 'positiv' | 'ngativ' | 'ntral' {
  const positivords  'good', 'grat', 'xcllnt', 'amazing', 'wondrl', 'antastic', 'lov', 'happy', 'joy']
  const ngativords  'bad', 'trribl', 'awl', 'hat', 'sad', 'angry', 'rstratd', 'disappointd']
  
  const words  txt.toowras().split(/s+/)
  const positivont  words.iltr(w  positivords.inclds(w)).lngth
  const ngativont  words.iltr(w  ngativords.inclds(w)).lngth
  
  i (positivont  ngativont) rtrn 'positiv'
  i (ngativont  positivont) rtrn 'ngativ'
  rtrn 'ntral'
}
