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
package com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.gmodel;

import java.util.Collection;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Component;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Subject;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class SubjectNodeMapper extends BaseGNodeMapper<Component, GNode> implements NamedElementGBuilder<Component> {

   @Override
   public GNode map(final Component source) {
      var builder = new GNodeBuilder(UmlUseCase_Subject.typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(buildCompartment(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final Component source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX);

      header.add(textBuilder(source, "<<Subsystem>>").build());

      var buildIconName = compartmentBuilder(source)
         .layout(GConstants.Layout.HBOX)
         .add(iconFromCssPropertyBuilder(source, "--uml-component-icon").build())
         .add(nameBuilder(source).build())
         .build();

      header.add(buildIconName);

      return header.build();
   }

   protected GCompartment buildCompartment(final Component source) {
      return freeformChildrenCompartmentBuilder(source)
         .addAll(source.getOwnedUseCases().stream()
            .map(mapHandler::handle)
            .collect(Collectors.toList()))
         .addAll(source.getOwnedUseCases().stream()
            .map(mapHandler::handleSiblings)
            .flatMap(Collection::stream)
            .collect(Collectors.toList()))
         .build();
   }
}
