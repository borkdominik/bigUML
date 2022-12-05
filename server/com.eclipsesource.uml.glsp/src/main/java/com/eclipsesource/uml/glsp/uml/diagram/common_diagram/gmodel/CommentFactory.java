/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.common_diagram.gmodel;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.Comment;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.diagram.common_diagram.constants.CommonTypes;
import com.google.inject.Inject;

public class CommentFactory {

   private final UmlModelState modelState;

   @Inject
   protected EMFIdGenerator idGenerator;

   public CommentFactory(final UmlModelState modelState) {
      this.modelState = modelState;
   }

   public List<GModelElement> create(final Comment comment) {
      List<GModelElement> result = new ArrayList<>();
      result.add(createCommentNode(comment));
      result
         .addAll(comment.getAnnotatedElements().stream().map(e -> createCommentEdge(comment, e))
            .collect(Collectors.toList()));
      return result;
   }

   private GNode createCommentNode(final Comment comment) {
      GNodeBuilder b = new GNodeBuilder(CommonTypes.COMMENT) //
         .id(idGenerator.getOrCreateId(comment)) //
         .layout(GConstants.Layout.VBOX) //
         .addCssClass(CoreCSS.NODE) //
         .add(buildHeader(comment));

      applyShapeData(comment, b);
      return b.build();
   }

   protected void applyShapeData(final Comment comment, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(comment, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }
         if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }

   protected GCompartment buildHeader(final Comment comment) {
      return new GCompartmentBuilder(CoreTypes.COMPARTMENT_HEADER) //
         .layout("hbox") //
         .id(idGenerator.getOrCreateId(comment) + "_header")
         .add(new GLabelBuilder(CoreTypes.LABEL_NAME) //
            .id(idGenerator.getOrCreateId(comment) + "_header_label").text(comment.getBody()) //
            .build()) //
         .build();
   }

   private GEdge createCommentEdge(final Comment comment, final Element target) {
      String sourceId = idGenerator.getOrCreateId(comment);
      String targetId = idGenerator.getOrCreateId(target);

      GEdgeBuilder builder = new GEdgeBuilder(CommonTypes.COMMENT_EDGE) //
         .id(idGenerator.getOrCreateId(comment) + "_link_" + idGenerator.getOrCreateId(target)) //
         .addCssClass(CoreCSS.EDGE) //
         .sourceId(sourceId) //
         .targetId(targetId) //
         .routerKind(GConstants.RouterKind.POLYLINE);

      return builder.build();
   }
}
