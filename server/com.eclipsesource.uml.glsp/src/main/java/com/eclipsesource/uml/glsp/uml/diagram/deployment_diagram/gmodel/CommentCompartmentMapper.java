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
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Comment;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.core.features.id_generator.IdCountContextGenerator;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Comment;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGModelMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;
import com.google.inject.Inject;

public final class CommentCompartmentMapper extends BaseGModelMapper<Comment, GCompartment>
   implements NamedElementGBuilder<NamedElement> {
   @Inject
   protected IdCountContextGenerator idCountGenerator;

   @Override
   public GCompartment map(final Comment source) {
      var builder = new GCompartmentBuilder(UmlDeployment_Comment.typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new GLayoutOptions()
            .hGap(3)
            .resizeContainer(true))
         .add(iconFromCssPropertyBuilder(source, "--uml-property-icon").build());

      return builder.build();
   }

}
