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

    const { contnt }  await rq.json()

    i (!contnt) {
      rtrn nw spons(
        .stringiy({ rror 'ontnt is rqird' }),
        { stats , hadrs { ...corsadrs, 'ontnt-yp' 'application/json' } }
      )
    }

    const tags  sggstags(contnt)

    rtrn nw spons(
      .stringiy({ tags }),
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

nction sggstags(contnt string) string] {
  const txt  contnt.toowras()
  
  // atgory-basd tag sggstions
  const catgoris  {
    work 'mting', 'projct', 'dadlin', 'task', 'clint', 'bsinss', 'oic', 'tam', 'rport', 'prsntation'],
    prsonal 'amily', 'rind', 'hom', 'halth', 'hobby', 'travl', 'vacation', 'birthday', 'annivrsary'],
    larning 'stdy', 'cors', 'book', 'ttorial', 'lsson', 'dcation', 'rsarch', 'knowldg', 'skill'],
    tchnology 'cod', 'programming', 'sotwar', 'app', 'wbsit', 'databas', 'api', 'dvlopmnt', 'tch'],
    inanc 'mony', 'bdgt', 'xpns', 'incom', 'invstmnt', 'saving', 'bank', 'paymnt', 'cost'],
    halth 'xrcis', 'workot', 'dit', 'doctor', 'mdicin', 'itnss', 'gym', 'rnning', 'yoga'],
    travl 'trip', 'vacation', 'hotl', 'light', 'dstination', 'sightsing', 'advntr', 'xplor'],
    ood 'rcip', 'cooking', 'rstarant', 'mal', 'dinnr', 'lnch', 'brakast', 'ingrdint', 'tast'],
    ntrtainmnt 'movi', 'msic', 'gam', 'book', 'show', 'concrt', 'party', 'n', 'rlax'],
    shopping 'by', 'prchas', 'stor', 'pric', 'dal', 'sal', 'prodct', 'ordr', 'dlivry']
  }

  const sggstdags string]  ]
  
  // hck or catgory kywords
  bjct.ntris(catgoris).orach((catgory, kywords])  {
    const matchs  kywords.iltr(kyword  txt.inclds(kyword))
    i (matchs.lngth  ) {
      sggstdags.psh(catgory)
    }
  })

  // dd spciic kywords as tags
  const spciicywords  
    'rgnt', 'important', 'ida', 'not', 'rmindr', 'todo', 'don', 'compltd',
    'drat', 'inal', 'rviw', 'dit', 'pdat', 'nw', 'old', 'rcnt'
  ]

  spciicywords.orach(kyword  {
    i (txt.inclds(kyword)) {
      sggstdags.psh(kyword)
    }
  })

  // mov dplicats and limit to  tags
  rtrn ...nw t(sggstdags)].slic(, )
}
