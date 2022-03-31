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
package com.eclipsesource.uml.glsp.gmodel;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import org.eclipse.emf.ecore.EObject;
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
import org.eclipse.uml2.uml.Comment;
import org.eclipse.uml2.uml.Element;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class CommentFactory {

   private final UmlModelState modelState;

   public CommentFactory(final UmlModelState modelState) {
      this.modelState = modelState;
   }

   public List<GModelElement> create(final Comment comment) {
      List<GModelElement> result = new ArrayList<>();
      result.add(createCommentNode(comment));
      result
            .addAll(comment.getAnnotatedElements().stream().map(e -> createCommentEdge(comment, e)).collect(Collectors.toList()));
      return result;
   }

   private GNode createCommentNode(final Comment comment) {
      GNodeBuilder b = new GNodeBuilder(Types.COMMENT) //
            .id(toId(comment)) //
            .layout(GConstants.Layout.VBOX) //
            .addCssClass(CSS.NODE) //
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
      return new GCompartmentBuilder(Types.COMPARTMENT_HEADER) //
            .layout("hbox") //
            .id(toId(comment) + "_header")
            .add(new GLabelBuilder(Types.LABEL_NAME) //
                  .id(toId(comment) + "_header_label").text(comment.getBody()) //
                  .build()) //
            .build();
   }

   private GEdge createCommentEdge(final Comment comment, final Element target) {
      String sourceId = toId(comment);
      String targetId = toId(target);

      GEdgeBuilder builder = new GEdgeBuilder(Types.COMMENT_EDGE) //
            .id(toId(comment) + "_link_" + toId(target)) //
            .addCssClass(CSS.EDGE) //
            .sourceId(sourceId) //
            .targetId(targetId) //
            .routerKind(GConstants.RouterKind.POLYLINE);

      return builder.build();
   }

   protected String toId(final EObject semanticElement) {
      String id = modelState.getIndex().getSemanticId(semanticElement).orElse(null);
      if (id == null) {
         id = UUID.randomUUID().toString();
         modelState.getIndex().indexSemantic(id, semanticElement);
      }
      return id;

   }
}
