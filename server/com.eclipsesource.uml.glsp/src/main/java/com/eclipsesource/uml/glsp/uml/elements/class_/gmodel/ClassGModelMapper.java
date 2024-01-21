/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.class_.gmodel;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.Class;

import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGNodeMapper;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public final class ClassGModelMapper extends RepresentationGNodeMapper<Class, GNode> {

   @Inject
   public ClassGModelMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GNode map(final Class source) {
      return new GClassBuilder<>(gmodelContext, source, configuration().typeId()).buildGModel();
   }

   @Override
   public List<GModelElement> mapSiblings(final Class source) {
      var siblings = new ArrayList<GModelElement>();

      siblings.addAll(mapHandler.handle(source.getGeneralizations()));
      siblings.addAll(mapHandler.handle(source.getInterfaceRealizations()));
      siblings.addAll(mapHandler.handle(source.getSubstitutions()));

      return siblings;
   }
}
