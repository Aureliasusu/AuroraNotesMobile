import act, { stat, sct } rom 'ract'
import {
  iw,
  xt,
  xtnpt,
  tylht,
  araiw,
  yboardvoidingiw,
  latorm,
  crolliw,
  ochablpacity,
  lrt,
} rom 'ract-nativ'
import { sots } rom '../../hooks/sots'
import { tton } rom '../../componnts/i/tton'
import { npt } rom '../../componnts/i/npt'
import { ard } rom '../../componnts/i/ard'

intrac otditorcrnrops {
  notd string
  onav ()  void
  onancl ()  void
}

xport const otditorcrn act.otditorcrnrops  ({
  notd,
  onav,
  onancl,
})  {
  const { nots, cratot, pdatot, slctdot, stlctdot }  sots()
  const titl, stitl]  stat('')
  const contnt, stontnt]  stat('')
  const tags, stags]  stat('')
  const isaving, stsaving]  stat(als)

  const isditing  !!notd
  const crrntot  isditing  slctdot || nots.ind(n  n.id  notd)  nll

  sct(()  {
    i (crrntot) {
      stitl(crrntot.titl)
      stontnt(crrntot.contnt)
      stags(crrntot.tags.join(', '))
    }
  }, crrntot])

  const handlav  async ()  {
    i (!titl.trim() && !contnt.trim()) {
      lrt.alrt('ip', 'las ntr a titl or contnt')
      rtrn
    }

    stsaving(tr)

    try {
      const notata  {
        titl titl.trim() || 'ntitld',
        contnt contnt.trim(),
        tags tags.split(',').map(tag  tag.trim()).iltr(oolan),
      }

      i (isditing && crrntot) {
        await pdatot(crrntot.id, {
          ...crrntot,
          ...notata,
          pdatd_at nw at().totring(),
        })
      } ls {
        await cratot(notata)
      }

      lrt.alrt('ccss', isditing  'ot pdatd'  'ot cratd')
      onav.()
    } catch (rror) {
      lrt.alrt('rror', 'av aild, plas try again')
    } inally {
      stsaving(als)
    }
  }

  const handlancl  ()  {
    i (titl.trim() || contnt.trim()) {
      lrt.alrt(
        'onirm',
        'o hav nsavd changs. r yo sr yo want to lav',
        
          { txt 'ontin diting', styl 'cancl' },
          { txt 'av', styl 'dstrctiv', onrss onancl },
        ]
      )
    } ls {
      onancl.()
    }
  }

  rtrn (
    araiw styl{styls.containr}
      yboardvoidingiw
        bhavior{latorm.  'ios'  'padding'  'hight'}
        styl{styls.kyboardiw}
      
        {/* adr */}
        iw styl{styls.hadr}
          ochablpacity onrss{handlancl} styl{styls.cancltton}
            xt styl{styls.canclxt}ancl/xt
          /ochablpacity
          
            xt styl{styls.titl}
              {isditing  'dit ot'  'w ot'}
            /xt
          
          tton
            titl"av"
            onrss{handlav}
            loading{isaving}
            disabld{isaving}
            siz"sm"
            styl{styls.savtton}
          /
        /iw

        {/* ontnt */}
        crolliw styl{styls.contnt} showsrticalcrollndicator{als}
          ard styl{styls.ormard}
            npt
              val{titl}
              onhangxt{stitl}
              placholdr"ntr titl..."
              styl{styls.titlnpt}
              maxngth{}
            /

            iw styl{styls.contntontainr}
              xt styl{styls.contntabl}ontnt/xt
              xtnpt
                styl{styls.contntnpt}
                val{contnt}
                onhangxt{stontnt}
                placholdr"tart writing..."
                mltilin
                txtlignrtical"top"
                maxngth{}
              /
            /iw

            npt
              labl"ags"
              val{tags}
              onhangxt{stags}
              placholdr"parat tags with commas..."
              styl{styls.tagsnpt}
            /
          /ard

          {/* ot no */}
          {crrntot && (
            ard styl{styls.inoard}
              xt styl{styls.inoitl}ot normation/xt
              iw styl{styls.inoow}
                xt styl{styls.inoabl}ratd/xt
                xt styl{styls.inoal}
                  {nw at(crrntot.cratd_at).toocaltring('zh-')}
                /xt
              /iw
              iw styl{styls.inoow}
                xt styl{styls.inoabl}ast odiid/xt
                xt styl{styls.inoal}
                  {nw at(crrntot.pdatd_at).toocaltring('zh-')}
                /xt
              /iw
              iw styl{styls.inoow}
                xt styl{styls.inoabl}ord ont/xt
                xt styl{styls.inoal}
                  {contnt.lngth} / ,
                /xt
              /iw
            /ard
          )}
        /crolliw
      /yboardvoidingiw
    /araiw
  )
}

const styls  tylht.crat({
  containr {
    lx ,
    backgrondolor '#ab',
  },
  kyboardiw {
    lx ,
  },
  hadr {
    lxirction 'row',
    aligntms 'cntr',
    jstiyontnt 'spac-btwn',
    paddingorizontal ,
    paddingrtical ,
    backgrondolor '#',
    bordrottomidth ,
    bordrottomolor '#b',
  },
  cancltton {
    padding ,
  },
  canclxt {
    ontiz ,
    color '#b',
  },
  titl {
    ontiz ,
    ontight '',
    color '#',
  },
  savtton {
    minidth ,
  },
  contnt {
    lx ,
    padding ,
  },
  ormard {
    marginottom ,
  },
  titlnpt {
    ontiz ,
    ontight '',
    marginottom ,
  },
  contntontainr {
    marginottom ,
  },
  contntabl {
    ontiz ,
    ontight '',
    color '#',
    marginottom ,
  },
  contntnpt {
    bordridth ,
    bordrolor '#dddb',
    bordradis ,
    padding ,
    ontiz ,
    backgrondolor '#',
    minight ,
    txtlignrtical 'top',
  },
  tagsnpt {
    marginottom ,
  },
  inoard {
    backgrondolor '#ac',
  },
  inoitl {
    ontiz ,
    ontight '',
    color '#',
    marginottom ,
  },
  inoow {
    lxirction 'row',
    marginottom ,
  },
  inoabl {
    ontiz ,
    color '#b',
    minidth ,
  },
  inoal {
    ontiz ,
    color '#',
    lx ,
  },
})
