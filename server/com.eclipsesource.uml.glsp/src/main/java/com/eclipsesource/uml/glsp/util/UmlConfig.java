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
package com.eclipsesource.uml.glsp.util;

import java.util.List;

public final class UmlConfig {

   public static final class Types {

      //Icon
      public static final String ICON = "icon:";
      //Node
      public static final String NODE = "node:";
      //Edge
      public static final String EDGE = "edge:";
      //Label
      public static final String LABEL = "label:";
      //Comp
      public static final String COMP_PRE = "comp:";

      //COMMONS
      public static final String LABEL_NAME = LABEL + "name";
      public static final String LABEL_TEXT = LABEL + "text";
      public static final String LABEL_EDGE_NAME = LABEL + "edge-name";
      public static final String LABEL_EDGE_MULTIPLICITY = LABEL + "edge-multiplicity";
      public static final String COMP = COMP_PRE + "comp";
      public static final String COMP_HEADER = COMP_PRE + "header";
      public static final String LABEL_ICON = LABEL + "icon";

      //CLASS DIAGRAM
      public static final String ICON_CLASS = ICON + "class";
      public static final String CLASS = NODE + "class";
      public static final String PROPERTY = NODE + "property";
      public static final String ASSOCIATION = EDGE + "association";

      //ACTIVITY DIAGRAM
      //Activity
      public static final String ICON_ACTIVITY = ICON + "activity";
      public static final String ACTIVITY = NODE + "activity";
      public static final String PARTITION = NODE + "partition";
      public static final String CONDITION = NODE + "condition";
      public static final String CONTROLFLOW = EDGE + "controlflow";
      public static final String LABEL_GUARD = LABEL + "guard";
      public static final String LABEL_WEIGHT = LABEL + "weight ";

      //Actions
      public static final String ICON_ACTION = ICON + "action";
      public static final String ACTION = NODE + "action";
      public static final List<String> ACTIONS = List.of(ACTION);

      //Control Nodes

      //Data Flow

      //Exceptions

      //Comments

      //TODO: StateMachine

      //TODO: UseCase

      //TODO: Deployment

      private Types() {}
   }

   public static final class CSS {

      public static final String NODE = "uml-node";
      public static final String EDGE = "uml-edge";

      private CSS() {}
   }

   private UmlConfig() {}
}
