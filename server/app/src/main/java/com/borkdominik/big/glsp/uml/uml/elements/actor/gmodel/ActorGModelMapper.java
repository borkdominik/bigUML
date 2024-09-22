/********************************************************************************
 * Copyright (c) 2021-2022 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.actor.gmodel;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.Actor;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.gmodel.BGEMFElementGModelMapper;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public final class ActorGModelMapper extends BGEMFElementGModelMapper<Actor, GNode> {

   @Inject
   public ActorGModelMapper(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   @Override
   public GNode map(final Actor source) {
      return new GActorBuilder<>(gcmodelContext, source, UMLTypes.ACTOR.prefix(representation))
         .buildGModel();
   }

   @Override
   public List<GModelElement> mapSiblings(final Actor source) {
      var siblings = new ArrayList<GModelElement>();

      siblings.addAll(mapHandler.handle(source.getGeneralizations()));

      return siblings;
   }

}
