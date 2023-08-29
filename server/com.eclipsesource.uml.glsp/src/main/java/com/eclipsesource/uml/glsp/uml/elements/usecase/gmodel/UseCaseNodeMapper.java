/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.usecase.gmodel;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.QuotationMark;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class UseCaseNodeMapper extends RepresentationGNodeMapper<UseCase, GNode>
   implements NamedElementGBuilder<UseCase> {

   @Inject
   public UseCaseNodeMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GNode map(final UseCase source) {
      var builder = new GNodeBuilder(configuration().typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   @Override
   public List<GModelElement> mapSiblings(final UseCase source) {
      var siblings = new ArrayList<GModelElement>();

      siblings.addAll(mapHandler.handle(source.getIncludes()));
      siblings.addAll(mapHandler.handle(source.getExtends()));
      siblings.addAll(mapHandler.handle(source.getGeneralizations()));

      return siblings;
   }

   protected GCompartment buildHeader(final UseCase source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(new GLayoutOptions().hAlign(GConstants.HAlign.CENTER));

      if (source.isAbstract()) {
         header.add(buildHeaderAnnotation(source, QuotationMark.quoteDoubleAngle("abstract")));
      }

      header.add(buildHeaderName(source, "--uml-use-case-icon"));

      return header.build();
   }
}
