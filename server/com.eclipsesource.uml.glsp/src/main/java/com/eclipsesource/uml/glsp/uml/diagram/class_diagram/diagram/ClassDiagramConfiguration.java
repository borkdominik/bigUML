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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.EdgeTypeHint;
import org.eclipse.glsp.server.types.ShapeTypeHint;

import com.eclipsesource.uml.glsp.core.diagram.DiagramConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_AbstractClass;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Association;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Class;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_DataType;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Enumeration;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_EnumerationLiteral;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Generalization;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Interface;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Operation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Package;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_PrimitiveType;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Property;
import com.google.common.collect.Lists;

public final class ClassDiagramConfiguration implements DiagramConfiguration {

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
         new EdgeTypeHint(UmlClass_Association.ASSOCIATION_TYPE_ID, true, true, true,
            List.of(UmlClass_AbstractClass.TYPE_ID, UmlClass_Class.TYPE_ID, UmlClass_Interface.TYPE_ID),
            List.of(UmlClass_AbstractClass.TYPE_ID, UmlClass_Class.TYPE_ID, UmlClass_Interface.TYPE_ID)),
         new EdgeTypeHint(UmlClass_Generalization.TYPE_ID, true, true, true,
            List.of(UmlClass_Class.TYPE_ID, UmlClass_AbstractClass.TYPE_ID),
            List.of(UmlClass_Class.TYPE_ID, UmlClass_AbstractClass.TYPE_ID)),
         new EdgeTypeHint(UmlClass_Association.COMPOSITION_TYPE_ID, true, true, true,
            List.of(UmlClass_AbstractClass.TYPE_ID, UmlClass_Class.TYPE_ID, UmlClass_Interface.TYPE_ID),
            List.of(UmlClass_AbstractClass.TYPE_ID, UmlClass_Class.TYPE_ID, UmlClass_Interface.TYPE_ID)),
         new EdgeTypeHint(UmlClass_Association.AGGREGATION_TYPE_ID, true, true, true,
            List.of(UmlClass_AbstractClass.TYPE_ID, UmlClass_Class.TYPE_ID, UmlClass_Interface.TYPE_ID),
            List.of(UmlClass_AbstractClass.TYPE_ID, UmlClass_Class.TYPE_ID, UmlClass_Interface.TYPE_ID)));
   }

   @Override
   public List<String> getGraphContainableElements() {
      return List.of(UmlClass_Class.TYPE_ID,
         UmlClass_Enumeration.TYPE_ID,
         UmlClass_Interface.TYPE_ID,
         UmlClass_AbstractClass.TYPE_ID,
         UmlClass_DataType.TYPE_ID,
         UmlClass_PrimitiveType.TYPE_ID,
         UmlClass_Package.TYPE_ID);
   }

   @Override
   public List<ShapeTypeHint> getShapeTypeHints() {
      List<ShapeTypeHint> hints = new ArrayList<>();

      hints.add(new ShapeTypeHint(UmlClass_Class.TYPE_ID, true, true, false, false,
         List.of(UmlClass_Property.TYPE_ID, UmlClass_Operation.TYPE_ID)));
      hints.add(new ShapeTypeHint(UmlClass_AbstractClass.TYPE_ID, true, true, false, false,
         List.of(UmlClass_Property.TYPE_ID, UmlClass_Operation.TYPE_ID)));
      hints.add(new ShapeTypeHint(UmlClass_Interface.TYPE_ID, true, true, false, false,
         List.of(UmlClass_Property.TYPE_ID, UmlClass_Operation.TYPE_ID)));
      hints.add(new ShapeTypeHint(UmlClass_Enumeration.TYPE_ID, true, true, false, false,
         List.of(UmlClass_EnumerationLiteral.TYPE_ID)));
      hints.add(new ShapeTypeHint(UmlClass_DataType.TYPE_ID, true, true, false, false,
         List.of(UmlClass_Property.TYPE_ID, UmlClass_Operation.TYPE_ID)));
      hints.add(new ShapeTypeHint(UmlClass_PrimitiveType.TYPE_ID, true, true, false, false,
         List.of(UmlClass_Property.TYPE_ID, UmlClass_Operation.TYPE_ID)));
      hints.add(new ShapeTypeHint(UmlClass_Package.TYPE_ID, true, true, true, false,
         List.of(UmlClass_Class.TYPE_ID,
            UmlClass_Enumeration.TYPE_ID,
            UmlClass_Interface.TYPE_ID,
            UmlClass_AbstractClass.TYPE_ID,
            UmlClass_DataType.TYPE_ID,
            UmlClass_PrimitiveType.TYPE_ID,
            UmlClass_Package.TYPE_ID)));

      hints.add(new ShapeTypeHint(UmlClass_Property.TYPE_ID, false, true, false, true,
         List.of()));
      hints.add(new ShapeTypeHint(UmlClass_EnumerationLiteral.TYPE_ID, false, true, false, true,
         List.of()));
      hints.add(new ShapeTypeHint(UmlClass_Operation.TYPE_ID, false, true, false, true,
         List.of()));

      return hints;
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      Map<String, EClass> mappings = DefaultTypes.getDefaultTypeMappings();

      mappings.put(UmlClass_Class.ICON, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UmlClass_Class.TYPE_ID, GraphPackage.Literals.GNODE);

      mappings.put(UmlClass_Enumeration.ICON, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UmlClass_Enumeration.TYPE_ID, GraphPackage.Literals.GNODE);

      mappings.put(UmlClass_EnumerationLiteral.ICON, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UmlClass_EnumerationLiteral.TYPE_ID, GraphPackage.Literals.GCOMPARTMENT);

      mappings.put(UmlClass_Interface.TYPE_ID, GraphPackage.Literals.GNODE);

      mappings.put(UmlClass_Association.ASSOCIATION_TYPE_ID, GraphPackage.Literals.GEDGE);
      mappings.put(UmlClass_Association.AGGREGATION_TYPE_ID, GraphPackage.Literals.GEDGE);
      mappings.put(UmlClass_Association.COMPOSITION_TYPE_ID, GraphPackage.Literals.GEDGE);

      mappings.put(UmlClass_Generalization.TYPE_ID, GraphPackage.Literals.GEDGE);

      mappings.put(UmlClass_Operation.ICON, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UmlClass_Operation.TYPE_ID, GraphPackage.Literals.GCOMPARTMENT);

      mappings.put(UmlClass_DataType.ICON, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UmlClass_DataType.TYPE_ID, GraphPackage.Literals.GNODE);

      mappings.put(UmlClass_PrimitiveType.ICON, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UmlClass_PrimitiveType.TYPE_ID, GraphPackage.Literals.GNODE);

      mappings.put(UmlClass_Package.ICON, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UmlClass_Package.TYPE_ID, GraphPackage.Literals.GNODE);

      mappings.put(UmlClass_Property.ICON, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UmlClass_Property.TYPE_ID, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UmlClass_Property.LABEL_TYPE, GraphPackage.Literals.GLABEL);
      mappings.put(UmlClass_Property.LABEL_MULTIPLICITY, GraphPackage.Literals.GLABEL);

      return mappings;
   }
}
