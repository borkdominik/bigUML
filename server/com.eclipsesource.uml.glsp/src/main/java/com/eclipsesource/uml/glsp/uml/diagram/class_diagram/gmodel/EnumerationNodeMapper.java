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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel;

import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.features.id_generator.IdCountContextGenerator;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Enumeration;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.utils.VisibilityKindUtils;
import com.google.inject.Inject;

public final class EnumerationNodeMapper extends BaseGNodeMapper<Enumeration, GNode> {
   @Inject
   protected IdCountContextGenerator idCountGenerator;

   @Override
   public GNode map(final Enumeration source) {
      var builder = new GNodeBuilder(UmlClass_Enumeration.TYPE_ID)
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(buildLiterals(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final Enumeration source) {
      var builder = new GCompartmentBuilder(CoreTypes.COMPARTMENT_HEADER)
         .id(idCountGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX);

      var typeLabel = new GLabelBuilder(CoreTypes.LABEL_TEXT)
         .id(idCountGenerator.getOrCreateId(source))
         .text("«Enumeration»")
         .build();
      builder.add(typeLabel);

      var compBuilder = new GCompartmentBuilder(CoreTypes.COMPARTMENT_HEADER)
         .id(idCountGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.HBOX);

      compBuilder.add(buildIconFromCssProperty(source, "--uml-enumeration-icon"));

      compBuilder.add(buildVisibility(source));

      var nameLabel = new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(suffix.appendTo(NameLabelSuffix.SUFFIX, idGenerator.getOrCreateId(source)))
         .text(source.getName())
         .build();
      compBuilder.add(nameLabel);

      builder.add(compBuilder.build());

      return builder.build();
   }

   protected GLabel buildVisibility(final NamedElement source) {
      return new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(idCountGenerator.getOrCreateId(source))
         .text(VisibilityKindUtils.asSingleLabel(source.getVisibility()))
         .build();
   }

   protected GCompartment buildLiterals(final Enumeration source) {
      var literals = source.getOwnedLiterals();

      var builder = new GCompartmentBuilder(CoreTypes.COMPARTMENT)
         .id(idCountGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX);

      var layoutOptions = new GLayoutOptions()
         .hAlign(GConstants.HAlign.LEFT)
         .resizeContainer(true);
      builder.layoutOptions(layoutOptions);

      var literalElements = literals.stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      builder.addAll(literalElements);

      return builder.build();

   }
}
