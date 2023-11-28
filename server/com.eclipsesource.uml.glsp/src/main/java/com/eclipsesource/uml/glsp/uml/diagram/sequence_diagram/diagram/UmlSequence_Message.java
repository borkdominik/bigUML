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
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.EdgeTypeHint;
import org.eclipse.uml2.uml.Message;

import com.eclipsesource.uml.glsp.core.diagram.DiagramElementConfiguration;
import com.eclipsesource.uml.glsp.uml.utils.QualifiedUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class UmlSequence_Message {

   public static String typeId() {
      return QualifiedUtil.representationTypeId(Representation.SEQUENCE, DefaultTypes.EDGE,
         Message.class.getSimpleName());
   }

   public static class Variant {
      public static String replyTypeId() {
         return QualifiedUtil.representationTemplateTypeId(Representation.SEQUENCE, DefaultTypes.EDGE, "reply",
            Message.class.getSimpleName());
      }

      public static String syncTypeId() {
         return QualifiedUtil.representationTemplateTypeId(Representation.SEQUENCE, DefaultTypes.EDGE, "sync",
            Message.class.getSimpleName());
      }

      public static String asyncTypeId() {
         return QualifiedUtil.representationTemplateTypeId(Representation.SEQUENCE, DefaultTypes.EDGE, "async",
            Message.class.getSimpleName());
      }

      public static String createTypeId() {
         return QualifiedUtil.representationTemplateTypeId(Representation.SEQUENCE, DefaultTypes.EDGE, "create",
            Message.class.getSimpleName());
      }

      public static String deleteTypeId() {
         return QualifiedUtil.representationTemplateTypeId(Representation.SEQUENCE, DefaultTypes.EDGE, "delete",
            Message.class.getSimpleName());
      }

      public static String foundTypeId() {
         return QualifiedUtil.representationTemplateTypeId(Representation.SEQUENCE, DefaultTypes.EDGE, "found",
            Message.class.getSimpleName());
      }

      public static String lostTypeId() {
         return QualifiedUtil.representationTemplateTypeId(Representation.SEQUENCE, DefaultTypes.EDGE, "lost",
            Message.class.getSimpleName());
      }
   }

   public enum Property {
      NAME,
      MESSAGE_SORT,
      MESSAGE_KIND,
      VISIBILITY_KIND
   }

   public static class DiagramConfiguration implements DiagramElementConfiguration.Edge {

      @Override
      public Map<String, EClass> getTypeMappings() { // TODO Auto-generated method stub
         return Map.of(
            typeId(), GraphPackage.Literals.GEDGE,
            Variant.replyTypeId(), GraphPackage.Literals.GEDGE,
            Variant.createTypeId(), GraphPackage.Literals.GEDGE,
            Variant.deleteTypeId(), GraphPackage.Literals.GEDGE,
            Variant.syncTypeId(), GraphPackage.Literals.GEDGE,
            Variant.asyncTypeId(), GraphPackage.Literals.GEDGE,
            Variant.foundTypeId(), GraphPackage.Literals.GEDGE,
            Variant.lostTypeId(), GraphPackage.Literals.GEDGE);
      }

      @Override
      public Set<EdgeTypeHint> getEdgeTypeHints() {
         return Set.of(
            new EdgeTypeHint(UmlSequence_Message.typeId(), false, true, false,
               List.of(UmlSequence_Lifeline.typeId()),
               List.of(UmlSequence_Lifeline.typeId())),
            new EdgeTypeHint(Variant.replyTypeId(), false, true, false,
               List.of(UmlSequence_Lifeline.typeId()),
               List.of(UmlSequence_Lifeline.typeId())),
            new EdgeTypeHint(Variant.createTypeId(), false, true, false,
               List.of(UmlSequence_Lifeline.typeId()),
               List.of(UmlSequence_Lifeline.typeId())),
            new EdgeTypeHint(Variant.deleteTypeId(), false, true, false,
               List.of(UmlSequence_Lifeline.typeId()),
               List.of(UmlSequence_Lifeline.typeId())),
            new EdgeTypeHint(Variant.syncTypeId(), false, true, false,
               List.of(UmlSequence_Lifeline.typeId()),
               List.of(UmlSequence_Lifeline.typeId())),
            new EdgeTypeHint(Variant.asyncTypeId(), false, true, false,
               List.of(UmlSequence_Lifeline.typeId()),
               List.of(UmlSequence_Lifeline.typeId())),
            new EdgeTypeHint(Variant.foundTypeId(), false, true, false,
               List.of(UmlSequence_Interaction.typeId()),
               List.of(UmlSequence_Lifeline.typeId())),
            new EdgeTypeHint(Variant.lostTypeId(), false, true, false,
               List.of(UmlSequence_Lifeline.typeId()),
               List.of(UmlSequence_Interaction.typeId())));
      }
   }
}
