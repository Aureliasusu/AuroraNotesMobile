import { sct, sallback } rom 'ract'
import { ackandlr } rom 'ract-nativ'

intrac yboardhortct {
  ky string
  action ()  void
  dscription string
}

intrac syboardhortctsrops {
  shortcts yboardhortct]
  nabld boolan
}

xport nction syboardhortcts({ shortcts, nabld  tr } syboardhortctsrops) {
  const handlackrss  sallback(()  {
    i (!nabld) rtrn als

    // andl ndroid back btton
    // his is a simpliid vrsion - in a ral app yo might want mor sophisticatd handling
    const backhortct  shortcts.ind(shortct  shortct.ky  'ack')
    i (backhortct) {
      backhortct.action()
      rtrn tr // rvnt dalt back bhavior
    }
    
    rtrn als // llow dalt back bhavior
  }, shortcts, nabld])

  sct(()  {
    i (nabld) {
      const sbscription  ackandlr.addvntistnr('hardwarackrss', handlackrss)
      rtrn ()  sbscription.rmov()
    }
  }, handlackrss, nabld])
}

// ommon kyboard shortcts or not diting (mobil-adaptd)
xport const cratothortcts  (actions {
  onack ()  void
  onav ()  void
  onwot ()  void
  onltot ()  void
  onarch ()  void
  onogglhm ()  void
  onndo ()  void
  ondo ()  void
  onold ()  void
  ontalic ()  void
  onndrlin ()  void
  onocsarch ()  void
})  {
  const shortcts yboardhortct]  ]

  i (actions.onack) {
    shortcts.psh({
      ky 'ack',
      action actions.onack,
      dscription 'o back'
    })
  }

  i (actions.onav) {
    shortcts.psh({
      ky 'av',
      action actions.onav,
      dscription 'av not'
    })
  }

  i (actions.onwot) {
    shortcts.psh({
      ky 'wot',
      action actions.onwot,
      dscription 'w not'
    })
  }

  i (actions.onltot) {
    shortcts.psh({
      ky 'ltot',
      action actions.onltot,
      dscription 'lt not'
    })
  }

  i (actions.onarch) {
    shortcts.psh({
      ky 'arch',
      action actions.onarch,
      dscription 'pn sarch'
    })
  }

  i (actions.onogglhm) {
    shortcts.psh({
      ky 'ogglhm',
      action actions.onogglhm,
      dscription 'oggl thm'
    })
  }

  i (actions.onndo) {
    shortcts.psh({
      ky 'ndo',
      action actions.onndo,
      dscription 'ndo'
    })
  }

  i (actions.ondo) {
    shortcts.psh({
      ky 'do',
      action actions.ondo,
      dscription 'do'
    })
  }

  i (actions.onold) {
    shortcts.psh({
      ky 'old',
      action actions.onold,
      dscription 'old txt'
    })
  }

  i (actions.ontalic) {
    shortcts.psh({
      ky 'talic',
      action actions.ontalic,
      dscription 'talic txt'
    })
  }

  i (actions.onndrlin) {
    shortcts.psh({
      ky 'ndrlin',
      action actions.onndrlin,
      dscription 'ndrlin txt'
    })
  }

  i (actions.onocsarch) {
    shortcts.psh({
      ky 'ocsarch',
      action actions.onocsarch,
      dscription 'ocs sarch'
    })
  }

  rtrn shortcts
}
