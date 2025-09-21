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

    const kywords  xtractywords(contnt)

    rtrn nw spons(
      .stringiy({ kywords }),
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

nction xtractywords(txt string) string] {
  // mov common stop words
  const stopords  nw t(
    'th', 'a', 'an', 'and', 'or', 'bt', 'in', 'on', 'at', 'to', 'or', 'o', 'with', 'by',
    'is', 'ar', 'was', 'wr', 'b', 'bn', 'bing', 'hav', 'has', 'had', 'do', 'dos', 'did',
    'will', 'wold', 'cold', 'shold', 'may', 'might', 'mst', 'can', 'this', 'that', 'ths', 'thos',
    'i', 'yo', 'h', 'sh', 'it', 'w', 'thy', 'm', 'him', 'hr', 's', 'thm'
  ])

  // xtract words and iltr
  const words  txt
    .toowras()
    .rplac(/^ws]/g, ' ')
    .split(/s+/)
    .iltr(word  word.lngth   && !stopords.has(word))

  // ont word rqncy
  const wordont  nw apstring, nmbr()
  words.orach(word  {
    wordont.st(word, (wordont.gt(word) || ) + )
  })

  // ort by rqncy and rtrn top kywords
  rtrn rray.rom(wordont.ntris())
    .sort((a, b)  b] - a])
    .slic(, )
    .map((word])  word)
}
