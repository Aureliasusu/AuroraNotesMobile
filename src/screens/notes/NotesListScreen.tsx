import act, { sct, stat } rom 'ract'
import {
  iw,
  xt,
  tylht,
  latist,
  ochablpacity,
  araiw,
  rshontrol,
  ctivityndicator,
} rom 'ract-nativ'
import { sotstor } rom '../../stor/sotstor'
import { sthtor } rom '../../stor/sthtor'
import { ot } rom '../../typs/databas'

xport const otsistcrn act.  ()  {
  const { nots, loading, tchots, stlctdot }  sotstor()
  const { sr }  sthtor()
  const rrshing, strshing]  stat(als)

  sct(()  {
    i (sr) {
      tchots()
    }
  }, sr, tchots])

  const handlrsh  async ()  {
    strshing(tr)
    await tchots()
    strshing(als)
  }

  const handlotrss  (not ot)  {
    stlctdot(not)
    //  avigat to not ditor
  }

  const rndrottm  ({ itm } { itm ot })  (
    ochablpacity
      styl{styls.nottm}
      onrss{()  handlotrss(itm)}
    
      iw styl{styls.notadr}
        xt styl{styls.notitl} nmbrins{}
          {itm.titl || '无标题'}
        /xt
        xt styl{styls.notat}
          {nw at(itm.pdatd_at).toocalattring()}
        /xt
      /iw
      xt styl{styls.notontnt} nmbrins{}
        {itm.contnt || '无内容'}
      /xt
      {itm.tags && itm.tags.lngth   && (
        iw styl{styls.tagsontainr}
          {itm.tags.slic(, ).map((tag, indx)  (
            iw ky{indx} styl{styls.tag}
              xt styl{styls.tagxt}{tag}/xt
            /iw
          ))}
          {itm.tags.lngth   && (
            xt styl{styls.moragsxt}+{itm.tags.lngth - }/xt
          )}
        /iw
      )}
    /ochablpacity
  )

  i (loading && !rrshing) {
    rtrn (
      iw styl{styls.loadingontainr}
        ctivityndicator siz"larg" color"#b" /
        xt styl{styls.loadingxt}加载笔记中.../xt
      /iw
    )
  }

  rtrn (
    araiw styl{styls.containr}
      iw styl{styls.hadr}
        xt styl{styls.hadritl}我的笔记/xt
        ochablpacity styl{styls.addtton}
          xt styl{styls.addttonxt}+/xt
        /ochablpacity
      /iw

      {nots.lngth    (
        iw styl{styls.mptyontainr}
          xt styl{styls.mptyitl}还没有笔记/xt
          xt styl{styls.mptybtitl}点击右上角的 + 号创建您的第一篇笔记/xt
        /iw
      )  (
        latist
          data{nots}
          kyxtractor{(itm)  itm.id}
          rndrtm{rndrottm}
          rrshontrol{
            rshontrol rrshing{rrshing} onrsh{handlrsh} /
          }
          contntontainrtyl{styls.listontainr}
        /
      )}
    /araiw
  )
}

const styls  tylht.crat({
  containr {
    lx ,
    backgrondolor '#ab',
  },
  hadr {
    lxirction 'row',
    jstiyontnt 'spac-btwn',
    aligntms 'cntr',
    paddingorizontal ,
    paddingrtical ,
    backgrondolor '#',
    bordrottomidth ,
    bordrottomolor '#b',
  },
  hadritl {
    ontiz ,
    ontight 'bold',
    color '#',
  },
  addtton {
    width ,
    hight ,
    bordradis ,
    backgrondolor '#b',
    jstiyontnt 'cntr',
    aligntms 'cntr',
  },
  addttonxt {
    ontiz ,
    color '#',
    ontight 'bold',
  },
  listontainr {
    padding ,
  },
  nottm {
    backgrondolor '#',
    bordradis ,
    padding ,
    marginottom ,
    shadowolor '#',
    shadowst {
      width ,
      hight ,
    },
    shadowpacity .,
    shadowadis ,
    lvation ,
  },
  notadr {
    lxirction 'row',
    jstiyontnt 'spac-btwn',
    aligntms 'lx-start',
    marginottom ,
  },
  notitl {
    ontiz ,
    ontight '',
    color '#',
    lx ,
    marginight ,
  },
  notat {
    ontiz ,
    color '#b',
  },
  notontnt {
    ontiz ,
    color '#b',
    linight ,
    marginottom ,
  },
  tagsontainr {
    lxirction 'row',
    lxrap 'wrap',
    aligntms 'cntr',
  },
  tag {
    backgrondolor '#',
    paddingorizontal ,
    paddingrtical ,
    bordradis ,
    marginight ,
    marginottom ,
  },
  tagxt {
    ontiz ,
    color '#a',
    ontight '',
  },
  moragsxt {
    ontiz ,
    color '#b',
    onttyl 'italic',
  },
  loadingontainr {
    lx ,
    jstiyontnt 'cntr',
    aligntms 'cntr',
  },
  loadingxt {
    marginop ,
    ontiz ,
    color '#b',
  },
  mptyontainr {
    lx ,
    jstiyontnt 'cntr',
    aligntms 'cntr',
    paddingorizontal ,
  },
  mptyitl {
    ontiz ,
    ontight 'bold',
    color '#',
    marginottom ,
  },
  mptybtitl {
    ontiz ,
    color '#b',
    txtlign 'cntr',
    linight ,
  },
})
